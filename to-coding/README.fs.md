## Nexus to CODING 

```
docker run -v <本地上传内容路径，如: /Download/com>:/root/workspace/<路径最后一级，如： com> \
-it --rm coding-public-docker.pkg.coding.net/wepack/docker/fs-to-coding:0.1.0 \
--source-path <上传文件地址，如 /root/workspace/com> \
--target <CODING 制品仓库地址，如 https://myteam-maven.pkg.coding.net/repository/my-project/my-repo/> \
--target-username <CODING 制品仓库访问账号> \
--target-password <CODING 制品仓库访问密码> \
--type maven
```


## TODO

- NPM
- Docker
- PyPI