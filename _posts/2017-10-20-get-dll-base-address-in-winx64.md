---
title: win64下栈溢出示例
key: 20171020
tags: Reverse
---

*《0day安全：软件漏洞分析技术》*中关于栈溢出部分代码植入有一个简单的例子。在32位下实现没有问题，但是在64位需要进一步分析user32.dll的基地址。
<!--more-->

使用32位的dependency walker可以查看函数的偏移地址，但是dll的基址却是错误的。64位的depends一直有问题。


利用代码获取dll基地址和函数地址
```c++
#include <windows.h>
#include <iostream>

using namespace std;

template<typename dst_type,typename src_type>
dst_type pointer_cast(src_type src)
{
    return *static_cast<dst_type*>(static_cast<void*>(&src));
}

main(){
	LoadLibrary("user32.dll");
	//HMODULE相当于程序运行时加载dll的基址
	HMODULE huser32=GetModuleHandle("user32.dll");
	cout << huser32 << endl;
	//获取函数的地址
	void* p = pointer_cast<void*>(&MessageBoxA);
	cout << p;
	system("pause");
}
```
> **release后运行才能得到正确的函数地址结果**