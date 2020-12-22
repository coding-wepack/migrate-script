# 批量上传 rpm 包至 CODING 制品库指引

## 准备环境

- CODING rpm 制品库
- 类 Unix 操作系统 （如 MacOS 或者 Linux）
- `cURL` 工具



## 快速开始

将所有需要上传的 rpm 包存放于同一目录下，之后执行以下命令即可：

```shell
find <包所在的目录> -type f -exec curl -T {} -u 用户名:密码 -X POST '<rpm 仓库地址>' \;
```

举个栗子：

查看目录下的 rpm 包

```shell
~
❯ ll tmp/rpm
total 1464
-rw-r--r--@ 1 coding  staff   5.3K 10 28 21:34 PackageKit-cron-1.1.10-2.el7.centos.x86_64.rpm
-rw-r--r--@ 1 coding  staff   102K 10 28 21:33 libgcc-4.8.5-39.el7.x86_64.rpm
-rw-r--r--@ 1 coding  staff   422K 10 28 21:33 tcpdump-4.9.2-4.el7_7.1.x86_64.rpm
-rw-r--r--@ 1 coding  staff   192K 10 28 21:24 yum-4.2.23-4.el8.noarch.rpm
```



上传：

```shell
~
❯ find tmp/rpm -type f -exec curl -T {} -u coding@coding.com:123456 -X POST 'http://codingcorp-rpm.pkg.coding.manso.live/migrate/pkgs/Packages' \;
Successfully pushed yum-4.2.23-4.el8.noarch.rpm
Successfully pushed tcpdump-4.9.2-4.el7_7.1.x86_64.rpm
Successfully pushed PackageKit-cron-1.1.10-2.el7.centos.x86_64.rpm
Successfully pushed libgcc-4.8.5-39.el7.x86_64.rpm
```

