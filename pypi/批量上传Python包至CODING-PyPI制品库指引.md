# 批量上传 Python 包至 CODING PyPI 制品库指引

## 准备工作

- CODING PyPI 制品库
- `Python` 运行环境
- [twine](https://pypi.org/project/twine/) 命令行工具



## 快速开始

如果你已经准备好了打包后的 Python 包，请将它们放于同一目录下，方便上传；如果还没有，请使用类似 `python setup.py sdist bdist_wheel`  的命令将你的项目打包成需要的格式，之后放于同一目录下。



### 命令行指定仓库上传

上传指令如下：

```shell
twine upload --repository-url <CODING PyPI 仓库地址> 包目录/* -u 用户名
```

之后 `twine` 会提示你输入用户名相应的密码，输入正确的密码回车即可批量上传目录下所有的包至远端仓库中。



示例：

[![B1im7T.png](https://s1.ax1x.com/2020/10/28/B1im7T.png)](https://imgchr.com/i/B1im7T)



[![B1iPhQ.png](https://s1.ax1x.com/2020/10/28/B1iPhQ.png)](https://imgchr.com/i/B1iPhQ)



### 以配置的形式上传

根据 CODING PyPI 仓库页面内的指引，我们配置 `Home` 目录下的 `.pypirc` 文件，之后指定配置的仓库名即可。



示例：

[![B1FBIU.png](https://s1.ax1x.com/2020/10/28/B1FBIU.png)](https://imgchr.com/i/B1FBIU)

