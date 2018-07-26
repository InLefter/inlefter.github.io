---
title: 使用树莓派搭建Time Capsule
key: 20170415
tags: Raspberry Pi
---

由于本地磁盘的备份分区差不多已经满了，所以利用手头的树莓派 3B实现了一个Time Capsule。

<!--more-->

### 步骤

1. 查看分区情况

   ```sh
   pi@howie_pi:~ $ sudo lsblk
   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
   sda           8:0    0 931.5G  0 disk
   ├─sda1        8:1    0   128M  0 part
   ├─sda2        8:2    0   200M  0 part
   ├─sda3        8:3    0   128M  0 part
   ├─sda4        8:4    0   500G  0 part /home/pi/nas
   ├─sda5        8:5    0   150G  0 part
   └─sda6        8:6    0   281G  0 part
   mmcblk0     179:0    0  14.5G  0 disk
   ├─mmcblk0p1 179:1    0    63M  0 part /boot
   └─mmcblk0p2 179:2    0  14.4G  0 part /
   ```


2. 准备分区，格式化。我选的是最后一个分区作为备份分区，`/dev/sda6`

   ```sh
   sudo mkfs.ext4 /dev/sda6
   ```

   ​关于分区格式，这里强调一点，选取ext4是可以备份的。如果选择hfs的话，容易出问题，提示未能完成备份等。

3. 新建挂载点

   ```sh
   $ sudo mkdir /mnt/TimeCapsule
   ```

4. 开机自动挂载，在`/etc/fstab`文件末加上：

   ```sh
   /dev/sda6	/mnt/TimeCapsule	ext4	rw,defaults	0	0
   ```

5. 重启或者`sudo mount -a`查看挂载情况

   ```sh
   pi@howie_pi:~ $ df -h
   Filesystem      Size  Used Avail Use% Mounted on
   /dev/root        15G  1.2G   13G   9% /
   devtmpfs        459M     0  459M   0% /dev
   tmpfs           463M     0  463M   0% /dev/shm
   tmpfs           463M   13M  451M   3% /run
   tmpfs           5.0M  4.0K  5.0M   1% /run/lock
   tmpfs           463M     0  463M   0% /sys/fs/cgroup
   /dev/mmcblk0p1   63M   21M   42M  33% /boot
   /dev/sda6       277G  110G  153G  42% /mnt/TimeCapsule
   /dev/sda4       500G  436G   65G  88% /home/pi/nas
   ```

6. 修改备份文件夹所有者

   ```sh
   $ sudo chown -R pi:pi /mnt/TimeCapsule
   ```

### Netatalk

>Netatalk is a free, open-source implementation of the Apple Filing Protocol (AFP). It allows Unix-like operating systems to serve as file servers for Macintosh computers.

1. 安装

   ```sh
   $ sudo apt-get install netatalk
   ```

2. 设置共享分区文件夹，在`/etc/netatalk/AppleVolumes.default`文件末加上之前设置的备份分区挂载目录

   ```sh
   # By default all users have access to their home directories.
   ~/                      "Home Directory"
   /mnt/TimeCapsule        "Time Capsule"  options:tm
   ```

3. 重启服务生效

   ```sh
   $ sudo systemctl restart netatalk
   ```

### 时间胶囊图标

​	编辑afpd.service来使树莓派在网络中模拟成Time Capsule，可以被Mac认为是Time Capsule，从而显示正常的图标。

​	新建配置文件：

```
$ sudo nano /etc/avahi/services/afpd.service
```

​	文件内容：

```xml
<?xml version="1.0" standalone='no'?><!--*-nxml-*-->
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
    <name replace-wildcards="yes">%h</name>
    <service>
        <type>_afpovertcp._tcp</type>
        <port>548</port>
    </service>
    <service>
        <type>_device-info._tcp</type>
        <port>0</port>
        <txt-record>model=TimeCapsule</txt-record>
    </service>
</service-group>
```

效果如图：

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/time-capsule/result.png)

但是这里不是很明白为什么会出现两个，应该是AFPD和Netatalk两个没有共同作用。

### 使用

最后直接在Time Machine中，找到发现的Time Capsule并设置备份分区。

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/time-capsule/set.png)



#### Refre To：

#### [How to Use a Raspberry Pi as a Networked Time Machine Drive For Your Mac](https://www.howtogeek.com/276468/how-to-use-a-raspberry-pi-as-a-networked-time-machine-drive-for-your-mac/)