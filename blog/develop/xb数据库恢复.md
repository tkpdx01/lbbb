---
slug: restore-xb-mysql-tencent
title: 腾讯云MySQL数据库xb冷备份恢复
date: 2024-07-28
authors: lbbb
tags: [xb,mysql]
keywords: [xb,mysql,5.7]
---
腾讯云 MySQL 数据库冷备份格式为 xb ，使用 xtrabackup 创建，恢复时也需要使用 xtrabackup ，目前还不支持 Windows 系统。本文介绍恢复过程及迁移到 Windows MySQL 中的过程。
<!-- truncate -->

![1722135212984](image/xb数据库恢复/1722135212984.png)
