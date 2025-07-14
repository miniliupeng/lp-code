### 一、常用 Linux 命令

Linux 命令是与操作系统交互的基础。下面是一些开发者最常用的命令，分为几类进行说明。

#### 1. 文件和目录管理

*   **`ls` (list)**: 列出目录内容。
    *   `ls`: 列出当前目录的文件和文件夹。
    *   `ls -l`: (long) 长格式显示，包含权限、所有者、大小、修改日期等详细信息。
    *   `ls -a`: (all) 显示所有文件，包括以 `.` 开头的隐藏文件。
    *   `ls -h`: (human-readable) 配合 `-l` 使用，以易于阅读的格式显示文件大小 (如 1K, 23M)。
    *   **常用组合**: `ls -alh`

*   **`cd` (change directory)**: 切换目录。
    *   `cd /path/to/directory`: 切换到指定目录。
    *   `cd ~` 或 `cd`: 切换到当前用户的家目录。
    *   `cd ..`: 切换到上级目录。
    *   `cd -`: 切换到上一个工作目录。

*   **`pwd` (print working directory)**: 显示当前所在的目录路径。

*   **`mkdir` (make directory)**: 创建新目录。
    *   `mkdir new_dir`: 创建一个名为 `new_dir` 的目录。
    *   `mkdir -p path/to/deep/dir`: (parents) 递归创建多层目录。

*   **`rm` (remove)**: 删除文件或目录。
    *   `rm file.txt`: 删除一个文件。
    *   `rm -r old_dir`: (recursive) 递归删除目录及其所有内容。
    *   `rm -f file.txt`: (force) 强制删除，不进行提示。
    *   **警告**: `rm -rf /` 是一个非常危险的命令，会删除根目录下的所有文件，请谨慎使用！

*   **`cp` (copy)**: 复制文件或目录。
    *   `cp source.txt destination.txt`: 复制文件。
    *   `cp source.txt ./target_dir/`: 将文件复制到目标目录。
    *   `cp -r source_dir/ target_dir/`: (recursive) 复制整个目录。

*   **`mv` (move)**: 移动或重命名文件/目录。
    *   `mv old_name.txt new_name.txt`: 重命名文件。
    *   `mv file.txt ./target_dir/`: 将文件移动到目标目录。

*   **`touch`**: 创建一个空文件或更新已有文件的时间戳。
    *   `touch new_file.log`

#### 2. 文件内容查看与处理

*   **`cat` (concatenate)**: 查看文件全部内容。适合小文件。
    *   `cat file.txt`

*   **`less`**: 分页查看文件内容，功能比 `more` 更强大。
    *   `less large_file.log`: 进入后可使用 `j/k` 或方向键上下滚动，按 `q` 退出。

*   **`head` / `tail`**: 查看文件的开头/结尾部分。
    *   `head -n 20 file.txt`: 查看文件的前 20 行。
    *   `tail -n 20 file.txt`: 查看文件的后 20 行。
    *   `tail -f app.log`: (follow) 实时跟踪文件的新增内容，常用于查看日志。

*   **`grep`**: 在文件中搜索指定的文本模式。
    *   `grep "error" app.log`: 在 `app.log` 中搜索包含 "error" 的行。
    *   `grep -r "myFunction" ./src`: (recursive) 在 `src` 目录下递归搜索。
    *   `grep -i "hello"`: (ignore-case) 忽略大小写。
    *   `grep -v "debug"`: (invert-match) 显示不匹配的行。

*   **`find`**: 在文件系统中查找文件。
    *   `find . -name "*.js"`: 查找当前目录下所有 `.js` 文件。
    *   `find /home -user myuser`: 查找 `/home` 目录下属于 `myuser` 的文件。
    *   `find . -type d`: 只查找目录。

#### 3. 系统信息和进程管理

*   **`ps` (process status)**: 显示当前用户的进程快照。
    *   `ps aux`: 显示系统中所有进程的详细信息。
    *   `ps aux | grep "nginx"`: 结合 `grep` 查找特定进程，例如 `nginx`。

*   **`top` / `htop`**: 实时显示系统资源使用情况和进程信息。`htop` 是 `top` 的增强版，显示更友好，推荐安装。

*   **`kill`**: 向进程发送信号，通常用于终止进程。
    *   `kill <PID>`: 终止指定 PID (Process ID) 的进程。
    *   `kill -9 <PID>`: 强制终止进程。

*   **`df` (disk free)**: 查看磁盘空间使用情况。
    *   `df -h`: (human-readable) 以易读的格式显示。

*   **`du` (disk usage)**: 查看文件或目录占用的磁盘空间。
    *   `du -sh /path/to/dir`: (summary, human-readable) 查看指定目录的总大小。

#### 4. 用户和权限管理

*   **`sudo` (superuser do)**: 以超级用户（root）权限执行命令。

*   **`chmod` (change mode)**: 修改文件或目录的权限。
    *   权限分为读(r=4), 写(w=2), 执行(x=1)。分别对应所有者(owner)、所属组(group)和其他用户(others)。
    *   `chmod 755 script.sh`: 设置 `script.sh` 权限为 `rwxr-xr-x` (所有者可读写执行，组用户和其他用户可读可执行)。
    *   `chmod +x script.sh`: 为所有用户添加可执行权限。

*   **`chown` (change owner)**: 修改文件或目录的所有者和所属组。
    *   `chown new_owner:new_group file.txt`

#### 5. 网络命令

*   **`ping`**: 测试与另一台主机的网络连通性。
    *   `ping google.com`

*   **`ifconfig` / `ip addr`**: 查看和配置网络接口。`ip addr` 是较新的推荐命令。

*   **`netstat`**: 显示网络连接、路由表等信息。
    *   `netstat -tulpn`: 显示所有监听中的 TCP/UDP 连接及其 PID。

*   **`ssh` (Secure Shell)**: 安全地远程登录到另一台主机。
    *   `ssh user@hostname`

*   **`scp` (secure copy)**: 在本地和远程主机之间安全地复制文件。
    *   `scp local_file.txt user@hostname:/remote/path/`
    *   `scp user@hostname:/remote/file.txt ./local_path/`

---

### 二、Vim 编辑器命令

Vim 是一个功能强大的文本编辑器，熟练使用可以极大地提高编码效率。它有多种模式，最核心的是以下三种：

*   **正常模式 (Normal Mode)**: 默认模式，用于移动光标、删除、复制等操作。
*   **插入模式 (Insert Mode)**: 用于输入文本。
*   **命令模式 (Command-Line Mode)**: 用于执行保存、退出、替换等命令，通过输入 `:` 进入。

#### 1. 模式切换

*   从 **正常模式** 进入 **插入模式**:
    *   `i`: 在光标前插入。
    *   `a`: 在光标后插入。
    *   `o`: 在当前行下方新建一行并进入插入模式。
    *   `O`: 在当前行上方新建一行并进入插入模式。
*   从 **任何模式** 返回 **正常模式**: 按 `Esc` 键。
*   从 **正常模式** 进入 **命令模式**: 按 `:` 键。

#### 2. 光标移动 (正常模式)

*   **基本移动**: `h` (左), `j` (下), `k` (上), `l` (右)。
*   **行内移动**:
    *   `0`: 移动到行首。
    *   `^`: 移动到行首的第一个非空白字符。
    *   `$`: 移动到行尾。
*   **词间移动**:
    *   `w`: 移动到下一个单词的词首。
    *   `b`: 移动到上一个单词的词首。
*   **文件内移动**:
    *   `gg`: 移动到文件第一行。
    *   `G`: 移动到文件最后一行。
    *   `<line_number>G` (例如 `50G`): 跳转到第 50 行。

#### 3. 文本编辑 (正常模式)

*   **删除 (Delete)**:
    *   `x`: 删除光标所在的字符。
    *   `dd`: 删除当前行。
    *   `dw`: 删除一个单词。
    *   `d$`: 删除从光标到行尾的内容。

*   **复制 (Yank)**:
    *   `yy`: 复制当前行。
    *   `yw`: 复制一个单词。
    *   `y$`: 复制从光标到行尾的内容。

*   **粘贴 (Paste)**:
    *   `p`: 在光标后粘贴。
    *   `P`: 在光标前粘贴。

*   **修改 (Change)**: (删除并进入插入模式)
    *   `cc`: 删除当前行并进入插入模式。
    *   `cw`: 删除一个单词并进入插入模式。

*   **撤销和重做**:
    *   `u`: 撤销上一步操作。
    *   `Ctrl + r`: 重做。

#### 4. 查找和替换 (命令模式)

*   **查找**:
    *   `/pattern`: 向下查找 `pattern`。按 `n` 查找下一个，`N` 查找上一个。
    *   `?pattern`: 向上查找 `pattern`。

*   **替换**:
    *   `:%s/old/new/g`: (substitute) 将文件中每一行的所有 `old` 替换为 `new`。
    *   `:%s/old/new/gc`: 替换前进行确认。
    *   `:10,20s/old/new/g`: 只在第 10 到 20 行进行替换。

#### 5. 保存和退出 (命令模式)

*   `:w`: (write) 保存文件。
*   `:q`: (quit) 退出。如果文件已修改但未保存，会失败。
*   `:wq`: 保存并退出。
*   `:x`: 功能同 `:wq`，但仅在文件被修改时才写入。
*   `:q!`: 强制退出，不保存修改。

---

### 三、Shell 脚本语法

Shell 脚本是自动化任务的利器。它是一系列 Shell 命令的集合，保存在一个文本文件中。

#### 1. 基本结构和变量

*   **Shebang**: 脚本的第一行通常是 `#!/bin/bash`，它告诉系统使用哪个解释器来执行此脚本。
*   **注释**: 以 `#` 开头的行是注释。
*   **变量**:
    *   定义: `MY_VAR="hello world"` (注意：等号两边不能有空格)。
    *   使用: `echo $MY_VAR` 或 `echo "${MY_VAR}"` (推荐用花括号包裹)。
*   **读取用户输入**: `read -p "Enter your name: " name`

#### 2. 条件语句

使用 `if-elif-else-fi` 结构。

```bash
#!/bin/bash

read -p "Enter a number: " num

if [ "$num" -gt 100 ]; then
  echo "The number is greater than 100."
elif [ "$num" -eq 100 ]; then
  echo "The number is exactly 100."
else
  echo "The number is less than 100."
fi
```

**常用判断条件**:
*   整数比较: `-eq` (等于), `-ne` (不等于), `-lt` (小于), `-le` (小于等于), `-gt` (大于), `-ge` (大于等于)。
*   字符串比较: `==` 或 `=` (等于), `!=` (不等于)。
*   文件判断: `-f` (是文件), `-d` (是目录), `-e` (存在), `-z` (字符串为空)。

#### 3. 循环语句

*   **`for` 循环**:

```bash
# 遍历列表
for fruit in apple banana orange; do
  echo "I like $fruit"
done

# C-style for loop
for (( i=0; i<5; i++ )); do
  echo "Number: $i"
done
```

*   **`while` 循环**:

```bash
count=1
while [ $count -le 5 ]; do
  echo "Count: $count"
  count=$((count + 1)) # 算术运算
done
```

#### 4. 函数

封装可重用的代码块。

```bash
#!/bin/bash

# 定义函数
function greet() {
  echo "Hello, $1!" # $1 是第一个参数
}

# 调用函数
greet "Alice"
greet "Bob"
```

#### 5. 输入/输出重定向和管道

*   **管道 `|`**: 将一个命令的输出 (`stdout`) 作为另一个命令的输入 (`stdin`)。
    *   `ps aux | grep "code"`: 查找所有包含 "code" 的进程。

*   **重定向 `>` 和 `>>`**:
    *   `ls -l > file_list.txt`: 将 `ls -l` 的输出写入文件，**覆盖**原有内容。
    *   `echo "New log entry" >> app.log`: 将内容**追加**到文件末尾。

*   **特殊变量**:
    *   `$0`: 脚本的名称。
    *   `$1`, `$2`, ...: 传递给脚本的第 1、2...个参数。
    *   `$#`: 传递给脚本的参数总数。
    *   `$@`: 所有参数，每个参数都是独立的字符串 (推荐使用)。
    *   `$?`: 上一个命令的退出状态码。0 表示成功，非 0 表示失败。
    - `$$`: 当前脚本的进程ID（PID）。

---

希望这份详细的指南对你有帮助！掌握这些基础工具，能让你的开发和运维工作更加得心应手。