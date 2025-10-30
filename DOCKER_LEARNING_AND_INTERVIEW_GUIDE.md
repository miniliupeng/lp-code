# Docker 学习与面试指南

这是一份为 Docker 初学者，特别是前端工程师，量身定制的系统性学习路径和面试准备手册。本文档旨在帮助你建立一个清晰的知识框架，从核心概念到实战技巧，再到面试核心问题，助你自信地掌握 Docker。

---

## 📖 大纲

-   **第一部分：Docker 核心概念 (打好地基)**
-   **第二部分：Docker 命令实战 (动手操作)**
-   **第三部分：Docker Compose (从单兵到集团军)**
-   **第四部分：Dockerfile 最佳实践 (高手进阶)**
-   **第五部分：面试核心问题 (决胜时刻)**

---

## 第一部分：Docker 核心概念 (打好地基)

### 1. 为什么需要 Docker？

-   **解决“在我电脑上能跑”的终极难题**：Docker 将应用及其所有依赖（代码、运行时、库、环境变量）打包到一个标准化的单元中，确保在任何地方都能以相同的方式运行。
-   **环境标准化与隔离**：为开发、测试、生产环境提供一致的运行环境，避免因环境差异导致的 bug。每个容器都是一个隔离的沙箱，互不影响。
-   **可移植性**：一次构建，随处运行。可以在任何安装了 Docker 的机器上运行，无论是本地、服务器还是云端。

### 2. 容器 vs. 虚拟机

这是最经典的面试题之一。

| 特性 | **容器 (Container)** | **虚拟机 (Virtual Machine)** |
|---|---|---|
| **类比** | **公寓楼里的公寓** | **独立别墅** |
| **隔离级别**| 进程级隔离 | 完全的操作系统级隔离 |
| **资源占用**| 轻量级，共享宿主机内核 | 重量级，每个 VM 都有完整的操作系统 |
| **启动速度**| 秒级 | 分钟级 |
| **性能**| 接近原生性能 | 有性能损耗 |
| **总结** | 更轻、更快、更高效 | 更重、更隔离、更安全 |

![Container vs VM](https://i.imgur.com/7gS1m5f.png)

### 3. Docker 核心架构

-   **Docker 客户端 (Client)**: 你在终端输入的 `docker` 命令。
-   **Docker 守护进程 (Daemon)**: 运行在宿主机上的后台服务，负责构建、运行和管理容器。
-   **镜像仓库 (Registry)**: 存储和分发 Docker 镜像的地方，最著名的是 Docker Hub。

### 4. Docker 的四大核心对象

-   **镜像 (Image)**: 一个只读的模板，包含了创建容器所需的一切。可以把它看作一个**类**或一个“凝固”的安装包。
-   **容器 (Container)**: 镜像的运行实例。可以把它看作一个**对象**或一个正在运行的程序。容器是可读写的。
-   **网络 (Network)**: 负责容器之间的通信，以及容器与外部世界的通信。默认情况下，同一网络下的容器可以通过服务名直接通信。
-   **数据卷 (Volume)**: 用于持久化存储容器产生的数据，它的生命周期独立于容器。可以把它看作容器的“外挂硬盘”。

### 5. `Dockerfile`

-   一个用来构建 Docker 镜像的文本文件，包含了一系列指令和参数。
-   它是将应用代码和环境“凝固”成镜像的“配方”。

---

## 第二部分：Docker 命令实战 (动手操作)

### 1. 镜像管理 (`docker image ...`)

-   `docker build -t <image_name>:<tag> .`: 根据当前目录的 `Dockerfile` 构建一个镜像。
-   `docker images`: 查看本地所有镜像。
-   `docker pull <image_name>:<tag>`: 从仓库拉取一个镜像。
-   `docker push <username>/<image_name>:<tag>`: 将一个本地镜像推送到仓库。
-   `docker rmi <image_id_or_name>`: 删除一个或多个镜像。
-   `docker tag <source_image> <target_image>`: 为镜像创建一个新的标签。

### 2. 容器生命周期 (`docker container ...`)

-   `docker run [OPTIONS] IMAGE [COMMAND]`: 从镜像创建并启动一个容器 (最核心的命令)。
    -   `-d`: 后台运行 (detached)。
    -   `-p <host_port>:<container_port>`: 端口映射。
    -   `-v <host_path>:<container_path>`: 挂载数据卷。
    -   `--name <container_name>`: 指定容器名称。
-   `docker ps`: 查看正在运行的容器。
    -   `docker ps -a`: 查看所有容器（包括已停止的）。
-   `docker stop/start/restart <container_id_or_name>`: 管理容器状态。
-   `docker rm <container_id_or_name>`: 删除一个或多个已停止的容器。
-   `docker exec -it <container_id_or_name> /bin/sh`: 进入正在运行的容器内部执行命令 (调试神器)。
-   `docker logs <container_id_or_name>`: 查看容器的日志输出。
    -   `-f`: 实时跟踪日志。

### 3. 系统管理与清理 (`docker system ...`)

-   `docker system prune`: 一键清理所有已停止的容器、无用的网络和悬空的镜像。
    -   `docker system prune -a --volumes`: **（危险）** 清理得更彻底，包括没在使用的镜像和数据卷。

---

## 第三部分：Docker Compose (从单兵到集团军)

### 1. 为什么需要 Docker Compose？

-   当你的应用由多个服务组成（如：前端 + 后端 + 数据库 + 缓存），手动管理每个容器的网络和依赖关系会非常复杂。
-   Docker Compose 允许你使用一个 `docker-compose.yml` 文件来定义和运行一个多容器的应用。

### 2. `docker-compose.yml` 文件详解

```yaml
services:
  # 服务1: 后端 API
  backend:
    build: ./backend  # 从 backend 目录的 Dockerfile 构建
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app # 代码热更新
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db # 依赖于 db 服务

  # 服务2: 数据库
  db:
    image: postgres:15-alpine # 直接使用官方镜像
    volumes:
      - db_data:/var/lib/postgresql/data # 数据持久化
    environment:
      - POSTGRES_PASSWORD=pass

volumes:
  db_data: # 声明命名卷
```

### 3. Compose 命令 (`docker-compose ...`)

-   `docker-compose up`: 创建并启动所有服务。`-d` 表示后台运行。
-   `docker-compose down`: 停止并移除所有服务的容器、网络。`-v` 会同时移除数据卷。
-   `docker-compose logs -f <service_name>`: 查看指定服务的日志。
-   `docker-compose exec <service_name> /bin/sh`: 进入指定服务的容器。
-   `docker-compose build <service_name>`: 构建或重新构建服务的镜像。

---

## 第四部分：Dockerfile 最佳实践 (高手进阶)

### 1. 优化镜像体积

-   **使用 `.dockerignore` 文件**: 类似于 `.gitignore`，防止不必要的文件（如 `node_modules`, `.git`）被复制到镜像中。
-   **选择更小的基础镜像**: 比如 `node:18-alpine` 而不是 `node:18`。Alpine 版本体积小，但可能缺少一些工具。
-   **多阶段构建 (Multi-stage builds)**: 这是**前端项目打包的利器**！在一个阶段用完整的 Node 环境构建前端静态文件，在下一个阶段只把构建产物（`dist` 目录）复制到一个轻量的 Nginx 服务器镜像中。

    ```dockerfile
    # --- Build Stage ---
    FROM node:18 as builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build

    # --- Production Stage ---
    FROM nginx:stable-alpine
    COPY --from=builder /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```

### 2. 提升构建效率

-   **利用构建缓存**: Docker 会缓存 `Dockerfile` 中的每一层。为了最大化利用缓存，应该把**不经常变动**的指令放在前面，**经常变动**的（如 `COPY . .`）放在后面。
    ```dockerfile
    # 变动最少的放前面
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    # 变动最频繁的放后面
    COPY . .
    ```
-   **合并 `RUN` 指令**: 使用 `&&` 将多个 `RUN` 命令合并为一条，减少镜像层数。

### 3. 安全实践

-   **不要使用 `root` 用户运行应用**: 在 `Dockerfile` 的末尾添加 `USER node` (或其他非 root 用户) 来提高安全性。

---

## 第五部分：面试核心问题 (决胜时刻)

### 1. 概念辨析题

-   **“镜像和容器的区别是什么？”**
    -   镜像是只读的模板（类），容器是镜像的可读写实例（对象）。
-   **“`COPY` 和 `ADD` 指令有什么区别？”**
    -   `ADD` 功能更强，可以解压本地 `tar` 文件和下载远程 URL，但一般推荐使用更透明的 `COPY`。
-   **“什么是 Docker 构建缓存？”**
    -   Docker 会缓存 `Dockerfile` 中每一条指令成功执行后生成的镜像层。如果指令和文件内容没有变化，下次构建会直接使用缓存，大大加快速度。

### 2. 场景设计题

-   **“如何为一个前端（React/Vue）应用编写 Dockerfile？”**
    -   **标准答案**：提到多阶段构建。第一阶段用 `node` 镜像 `npm install` 和 `npm run build`，第二阶段用 `nginx` 镜像托管 `dist` 目录的静态文件。
-   **“你的镜像非常大，有哪些方法可以优化？”**
    -   多阶段构建、使用 `.dockerignore`、使用 `alpine` 基础镜像、清理 `RUN` 指令中的缓存。
-   **“一个容器启动后马上就退出了，你会如何排查问题？”**
    -   `docker logs <container_id>` 查看容器的最后输出，通常能看到错误日志。
    -   `docker inspect <container_id>` 查看容器的详细配置和状态。

### 3. 数据与网络题

-   **“解释一下绑定挂载 (bind mount) 和命名卷 (named volume) 的区别和适用场景。”**
    -   **绑定挂载**：将宿主机上的任意文件/目录挂载到容器中。适用于**代码热更新**、共享配置文件。但可移植性差。
    -   **命名卷**：由 Docker 管理的卷，与宿主机文件系统解耦。适用于**持久化存储数据**（如数据库文件）。可移植性好。
-   **“Docker 容器之间是如何通信的？”**
    -   通过 Docker 网络。在同一个 `docker-compose` 项目中，默认会创建一个网络，服务之间可以通过**服务名**作为主机名直接通信。

---

## 第六部分：高级网络概念

### 1. 网络驱动 (Network Drivers)

-   **`bridge` (默认)**: 最常用的模式。Docker 会创建一个虚拟的网桥，连接到该网络的容器会获得一个内部 IP，它们之间可以通信，但与外部隔离。需要通过端口映射 (`ports`) 才能从宿主机访问。
-   **`host`**: 容器将不会拥有自己独立的网络命名空间，而是直接共享宿主机的网络。这意味着容器直接使用宿主机的 IP 和端口，性能最高，但牺牲了隔离性。
-   **`overlay`**: 用于 Docker Swarm 模式，可以让运行在不同宿主机上的容器相互通信，是实现多机容器集群网络的基础。
-   **`none`**: 容器将拥有自己的网络命名空间，但不会进行任何网络配置。容器是完全隔离的，没有网络连接。

### 2. 发布端口 vs. 暴露端口 (`ports` vs `expose`)

-   **`expose` (Dockerfile 指令)**:
    -   仅仅是一个**元数据声明**，告诉 Docker 容器内的应用程序将监听哪个端口。
    -   它**不会**自动将端口映射到宿主机，外部无法直接访问。
    -   主要用于方便同一网络下的其他容器知道可以连接到哪个端口。
-   **`ports` (`docker run` 或 `docker-compose.yml` 配置)**:
    -   **实际的端口映射**操作。
    -   它会将容器的端口绑定到宿主机的端口上，使得外部可以访问该容器。

---

## 第七部分：Docker 安全

### 1. 镜像安全

-   **使用官方或受信任的基础镜像**：避免使用来源不明的镜像，减少被植入恶意软件的风险。
-   **定期扫描镜像漏洞**：使用工具如 `Snyk`, `Trivy` 或 `Clair` 来扫描你的镜像，发现并修复已知的安全漏洞。
-   **最小化镜像**: 镜像中只包含运行应用所必需的最小依赖集，减少攻击面。

### 2. 容器安全

-   **最小权限原则**: 默认情况下，容器拥有强大的能力。应使用 `--cap-drop=ALL` 丢弃所有不必要的能力，然后用 `--cap-add` 只添加必需的能力。
-   **以非 Root 用户运行**: 在 `Dockerfile` 的末尾使用 `USER` 指令切换到非 root 用户，即使应用被攻破，攻击者也无法获得 root 权限。
-   **设置资源限制**: 使用 `--memory` 和 `--cpus` 选项来限制容器可以使用的资源，防止某个容器耗尽系统资源（DoS 攻击）。

---

## 第八部分：容器编排进阶

在你精通 Docker 和 Docker Compose 之后，下一步就是学习如何管理大规模的容器集群。

### 1. Docker Swarm

-   Docker 官方提供的**轻量级**容器编排工具，内置于 Docker 引擎中，非常容易上手。
-   适用于中小型项目，可以快速实现服务的水平扩展、滚动更新和负载均衡。

### 2. Kubernetes (K8s)

-   由 Google 开源，目前是容器编排领域的**事实标准**和最终的解决方案。
-   功能极其强大，但学习曲线也更陡峭。它提供了自动部署、扩展、服务发现、自我修复等一系列高级功能。
-   掌握 K8s 是衡量 Docker 技能是否达到“专家”级别的一个重要标志。

---

## 第九部分：性能与监控

### 1. 资源限制

-   在生产环境中，必须为容器设置资源限制，以保证服务的稳定性和公平性。
    -   `docker run --memory="2g"`: 限制容器最大使用 2GB 内存。
    -   `docker run --cpus="1.5"`: 限制容器最多使用 1.5 个 CPU 核心。
    -   在 `docker-compose.yml` 中通过 `deploy.resources.limits` 配置。

### 2. 容器监控

-   **`docker stats`**: 一个简单的内置命令，可以实时查看所有正在运行的容器的 CPU、内存、网络 I/O 等使用情况。
-   **专业监控方案**: 在生产环境中，通常会使用更专业的工具链，如：
    -   **Prometheus**: 用于收集和存储时序指标数据。
    -   **Grafana**: 用于将 Prometheus 收集的数据进行可视化展示，创建漂亮的监控仪表盘。
    -   **cAdvisor**: Google 开源的工具，用于收集容器的资源使用和性能数据，通常与 Prometheus 配合使用。
