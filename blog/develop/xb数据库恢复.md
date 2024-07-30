---
slug: /tencent-mysql-xb-restore
title: 腾讯云MySQL数据库xb冷备份恢复
image: https://raw.githubusercontent.com/tkpdx01/photo/main/202407281625664.png
---
腾讯云 MySQL 数据库冷备份格式为 xb，使用 XtraBackup 创建，恢复时也需要使用 XtraBackup，目前还不支持 Windows 系统。本文记录了恢复过程及迁移到 Windows MySQL 的过程。

<!-- truncate -->

### 腾讯云官方教程

[使用物理备份恢复数据库](https://cloud.tencent.com/document/product/236/33363) 中有两点较为重要：

1. XtraBackup 只支持 Linux 平台，不支持 Windows 平台。
2. Windows 平台恢复数据请参考 [命令行工具迁移数据](https://cloud.tencent.com/document/product/236/8464)。

实际上，想在 Windows 平台上恢复 .XB 格式的冷备份文件并不复杂。我们需要在 Linux 平台上解压、恢复出数据文件，再打包拷贝至 Windows 上即可。下面是具体操作步骤。

### 1. 安装 Percona XtraBackup

在安装之前，需要根据 MySQL 版本选择对应的 XtraBackup 版本。MySQL 8.0 使用 XtraBackup 8.0，否则应使用 XtraBackup 2.4。可以在 [Percona 官网](https://www.percona.com/downloads) 选择对应的版本。

![1722154548733](image/xb数据库恢复/1722154548733.png)

### 2. 解包、解压备份的 .xb 文件

❗ 请确保磁盘空间足够。以下是最近一次操作的示例：

| .xb文件大小 | 处理后文件大小 | 再次打包后文件大小（方便移动至 Windows 环境） |
| ----------- | -------------- | --------------------------------------------- |
| 50GB        | 200GB          | 83GB                                          |

使用冷备份方式备份的数据库一般很大，所以 .xb 文件也很大。将 .xb 文件转移到 Linux 环境中有三种方式：

1. 在 Linux 环境中使用 wget、curl 等工具直接下载 .xb 文件
2. 通过局域网传输
3. 通过移动存储设备拷贝（尽量使用高速移动存储设备）

使用 xbstream 解包 .xb 文件
```bash
xbstream -x --decrypt=AES256 --encrypt-key-file=<备份密钥文件> --parallel=2 -C /data/mysql < /data/test.xb
```
解包之后的文件使用 xtrabackup 解压
```bash
xtrabackup --decompress --target-dir=/data/mysql
```

### 3. 处理解压后的 .qb 文件

解包、解压完毕之后的文件还需要使用 xtrabackup 处理才能被 MySQL 识别
```bash
xtrabackup --prepare --target-dir=/data/mysql
```

> 上述过程可能较为漫长，请耐心等待。

### 4. 打包 MySQL data 目录并复制到 Windows
```bash
tar -czf data_mysql.tar.gz -C /data mysql
```
兼顾压缩率与打包速度的命令。

### 5. 在 Windows 上使用 data 目录恢复数据库

将第 4 步中打包的 data_mysql.tar.gz 拷贝至 Windows 电脑中，解压备用。确保 Windows 环境中安装有对应版本的 MySQL。在进行恢复之前，停止 mysqld 服务，找到配置文件 my.ini，修改其中的 datadir
```ini
datadir=D:/data/
```
重新开启 MySQL 服务即可完成数据库的恢复。
