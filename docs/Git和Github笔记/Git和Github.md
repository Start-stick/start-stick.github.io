### 分支

<img src="https://docusaurus-oss.oss-cn-beijing.aliyuncs.com/屏幕截图 2024-12-08 222812.png" alt="屏幕截图 2024-12-08 222812"/>

git在存储文件时，每一次代码的提交都会创建一个与之对应的节点，git就是通过一个一个的节点来记录代码的状态的。酒店会构成一个树状结构，树状结构就意味着这个树会存在分支，默认情况下仓库只有一个分支，命名未master。在使用git时，可以创建多个分支，分支与分支之间相互独立，在一个分支上修改代码不会影响其他的分支。

```bash
git branch # 查看当前分支
git branch <branch name> # 创建新的分支
git branch -d <branch name> # 删除分支
git switch <branch name> # 切换分支
git switch -c <branch name> # 创建并切换分支
```

当上线项目出现bug时，创建分支，在新分支上修改bug

在开发中，都是在自己的分支上编写代码，代码编写完成后，再将自己的分支合并到主分支中。

合并分支是否都要处理冲突？

不是，要看两个分支是否在同一处有修改。如果两个分支都对一个文件夹有修改，只要不是对同一个文件的修改就可以直接合并。

### 变基（rebase)

<img src="https://docusaurus-oss.oss-cn-beijing.aliyuncs.com/屏幕截图 2024-12-08 224159.png" alt="屏幕截图 2024-12-08 224159" />

在开发中除了通过merg来合并分支外，还可以通过变基来实现合并分支

使用merg合并分支时，在提交记录中会将所有的分支创建和分支合并的过程全都显示出来，这样当项目比较复杂，开发过程比较波折时，会使得我们代码的提交记录表的几位混乱。

好处：没有产生多余的分支


 

原理（变基时发生了什么）：

1. 当我们发起变基时，git首先找到两条分支的最近共同祖先
2. 对比当前分支相对于祖先的历史提交，并且将它们提取出来储存到一个临时文件中
3. 将当前部分指向目标的基底
4. 以当前基底开始，重新执行历史操作

变基和merge对于合并分支来说最终的结果是一样的！但是变基会使得代码记录更整洁更清晰！注意：大部分情况下合并和变基是可以互换的，但是如果分支已经提交给了远程仓库，那么这是尽量不要变基。

### 远程仓库（remote)

远程的仓库可以被多人同时访问使用，方便协同开发。在实际工作中，git的服务器通常由公司搭建内部使用或是购买一些公共的私有git服务器。学习阶段，使用开放的公共git仓库。目前常用库：GItHub和Gitee(码云)

将本地库上传git:

```bash
git remote add origin https://github.com/Start-stick/git-demo.git
#git remote add <remote name> URL

git branch -M main
#修改当前分支的名字为main

git push -u origin main
#git push 将代码上传服务器上
```

将本地库上传gitee:

```bash
cd existing_git_repo
#切换当前工作目录到一个已存在的Git仓库目录

git remote add gitee https://gitee.com/willbebith/git-demo.git
git push -u gitee main
```

通过http克隆远程仓库

```bash
git clone <http> [<new name>]
```

###远程库的基本操作命令

```bash
git remote # 列出当前的关联的远程库
git remote add <远程库名> <url> # 关联远程仓库
git remote remove <远程库名>  # 删除远程库
git push -u <远程库名> <分支名> [:<别名>]# 向远程库推送代码，并和当前分支关联（默认往该远程库推送） 
git push <远程库> <本地分支>:<远程分支> # []将本地分支推送到远程库的远程分支

git push # 如果本地的版本低于远程库，push默认是推不上去
git fetch # 要想推送成功，必须先确保本地库和远程库的版本一致，fetch它会从远程仓库下载所有代码，但是它不会将代码和当前分支自动合并 
          #本地库看到的仍是旧的内容
		 # 使用fetch拉取代码后，必须要手动对代码进行合并
git pull  # 从服务器上拉取代码并自动合并
```

注意：推送代码之前，一定要先从远程库中拉取最新的代码并合并

fetch操作更灵活，当分支较多时，建议使用

### tag标签

- 当头指针没有执行某个分支的头部时，这种状态我们称为分离头指针（HEAD detached），分离头指针的状态下也可以操作操作代码，但是这些操作不会出现在任何的分支上，所以注意不要再分离头指针的状态下来操作仓库。
- 如果非得要回到后边的节点对代码进行操作，则可以选择创建分支后再操作

```bash
git switch -c <分支名> <提交id>
```

- 可以为提交记录设置标签，设置标签以后，可以通过标签快速的识别出不同的开发节点：

```bash
git tag
git tag 版本
git tag 版本 提交id
git push 远程仓库 标签名
git push 远程仓库 --tags
git tag -d 标签名 # 删除标签
git push 远程仓库 --delete 标签名 # 删除远程标签
```

小技巧通过vscode打开文件：

在文件终端输入

```bash
code .
```

### gitignore

- 默认情况下，git 会监视项目中所有内容，但是有些内容比如 node_modules 目录中的内容，我们不希望它被 git 所管理。我们可以在项目目录中添加一个`.gitignore`文件，来设置那些需要 git 忽略的文件。

### github的静态页面

- 在 github 中，可以将自己的静态页面直接部署到 github 中，它会给我们提供一个地址使得我们的页面变成一个真正的网站，可以供用户访问。
- 要求：
  - 静态页面的分支必须叫做：gh-pages
  - 如果希望页面可以通过 xxx.github.io 访问，则需要将库的名字配置为 xxx.github.io


### docusaurus

- facebook 推出的开源的静态的内容管理系统，通过它可以快速的部署一个静态网站


- 使用：


- - 网址：



  - 安装
    - npx create-docusaurus@latest my-website classic`

  - 启动项目
    - `npm start`或`yarn start`

  - 构建项目

    - `npm run build`或`yarn build`
    - 静态部署--直接将build文件丢到服务器，index.html打开

  - 一步部署项目到github

    - `yarn deploy `一定要用token令牌验证身份否则会报错

  - 配置项目：

    - docusaurus.config.js 项目的配置文件

  - 添加页面：
    - 在 docusaurus 框架中，页面分成三种：1.page，2.blog，3.doc

    - page:page下创建文件(js 推荐，md)，通过文件名访问页面

    - blog:博客，

    - doc:

      传图片，内存大不要直接传 容易超出，码云上oss再关联

  - 案例地址：

      ​











