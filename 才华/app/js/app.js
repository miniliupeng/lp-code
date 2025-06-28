// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const cardContainer = document.querySelector('.card-container');
    const categoryTabs = document.querySelectorAll('.nav li');
    const emotionTags = document.querySelectorAll('.tag');
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    const collectionBtn = document.querySelector('.collection-btn');
    const noResults = document.querySelector('.no-results');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const poemDetailModal = document.getElementById('poemDetail');
    const modalCloseBtn = poemDetailModal.querySelector('.close-btn');
    const toastContainer = document.querySelector('.toast-container');

    // 应用状态
    const appState = {
        currentCategory: 'all',
        currentTag: 'all',
        favoritePoems: JSON.parse(localStorage.getItem('favoritePoems') || '[]'),
        showingFavorites: false,
        speechSynthesis: window.speechSynthesis,
        speechUtterance: null,
        lastSearchResults: [],
        isPlaying: false
    };

    // 初始化
    init();

    // 初始化函数
    function init() {
        // 加载并显示诗词
        displayPoems();
        
        // 绑定事件
        bindEvents();

        // 创建语音合成对象
        if (appState.speechSynthesis) {
            appState.speechUtterance = new SpeechSynthesisUtterance();
            appState.speechUtterance.lang = 'zh-CN';
            appState.speechUtterance.rate = 0.9;
            appState.speechUtterance.pitch = 1;
        }

        // 从本地存储加载收藏
        loadFavorites();
    }

    // 显示诗词卡片
    function displayPoems(poems = null) {
        showLoading();

        // 清空容器
        cardContainer.innerHTML = '';

        // 如果没有指定诗词，则根据当前分类和标签获取
        if (!poems) {
            if (appState.showingFavorites) {
                poems = appState.favoritePoems.map(id => window.poemManager.getPoemById(id));
            } else {
                poems = window.poemManager.getPoemsByTag(
                    appState.currentTag,
                    window.poemManager.getPoemsByCategory(appState.currentCategory)
                );
            }
        }

        appState.lastSearchResults = poems;

        // 如果没有结果
        if (poems.length === 0) {
            noResults.classList.remove('hidden');
            hideLoading();
            return;
        } else {
            noResults.classList.add('hidden');
        }

        // 创建卡片
        poems.forEach(poem => {
            const card = createPoemCard(poem);
            cardContainer.appendChild(card);
        });

        // 添加卡片动画
        setTimeout(() => {
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
            hideLoading();
        }, 300);
    }

    // 创建诗词卡片
    function createPoemCard(poem) {
        const template = document.getElementById('card-template');
        const cardClone = document.importNode(template.content, true);
        
        // 填充卡片内容
        const card = cardClone.querySelector('.card');
        card.dataset.id = poem.id;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';

        // 前面：白话
        const plainText = cardClone.querySelector('.card-front .plain-text');
        plainText.textContent = poem.plainText;

        // 后面：诗词
        const poemText = cardClone.querySelector('.card-back .poem-text');
        poemText.textContent = poem.poemText;

        // 类别标签
        const categoryTag = cardClone.querySelector('.category-tag');
        categoryTag.textContent = poem.category;
        
        // 收藏状态
        if (appState.favoritePoems.includes(poem.id)) {
            card.classList.add('favorite');
        }

        return cardClone;
    }

    // 显示诗词详情
    function showPoemDetail(poem) {
        const modal = document.getElementById('poemDetail');
        modal.querySelector('.plain-text').textContent = poem.plainText;
        modal.querySelector('.poem-text-content').textContent = poem.poemText;
        
        // 添加作者、朝代等信息
        const author = modal.querySelector('.poem-author');
        const dynasty = modal.querySelector('.poem-dynasty');
        const category = modal.querySelector('.poem-category');
        
        author.textContent = `作者：${poem.author}`;
        dynasty.textContent = `朝代：${poem.dynasty}`;
        category.textContent = `分类：${poem.category}`;
        
        // 收藏按钮状态
        const favoriteBtn = modal.querySelector('.favorite-btn');
        if (appState.favoritePoems.includes(poem.id)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
            favoriteBtn.classList.add('active');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
            favoriteBtn.classList.remove('active');
        }
        
        // 显示模态框
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 绑定事件
    function bindEvents() {
        // 分类标签切换
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                appState.currentCategory = this.dataset.category;
                appState.showingFavorites = false;
                displayPoems();
            });
        });

        // 情感标签过滤
        emotionTags.forEach(tag => {
            tag.addEventListener('click', function() {
                emotionTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                appState.currentTag = this.dataset.emotion;
                displayPoems();
            });
        });

        // 搜索功能
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 卡片翻转
        cardContainer.addEventListener('click', function(e) {
            const flipBtn = e.target.closest('.flip-btn');
            const detailBtn = e.target.closest('.detail-btn');
            
            if (flipBtn) {
                const card = flipBtn.closest('.card');
                card.classList.toggle('flipped');
            } else if (detailBtn) {
                const card = detailBtn.closest('.card');
                const poemId = card.dataset.id;
                const poem = window.poemManager.getPoemById(poemId);
                showPoemDetail(poem);
            }
        });

        // 关闭模态框
        modalCloseBtn.addEventListener('click', function() {
            closeModal();
        });

        // 点击外部关闭模态框
        poemDetailModal.addEventListener('click', function(e) {
            if (e.target === poemDetailModal) {
                closeModal();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && poemDetailModal.classList.contains('show')) {
                closeModal();
            }
        });

        // 收藏按钮
        document.addEventListener('click', function(e) {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                const modal = favoriteBtn.closest('.modal');
                const plainText = modal.querySelector('.plain-text').textContent;
                const poem = appState.lastSearchResults.find(p => p.plainText === plainText);
                
                if (poem) {
                    toggleFavorite(poem.id, favoriteBtn);
                }
            }
        });

        // 朗读按钮
        document.addEventListener('click', function(e) {
            const readBtn = e.target.closest('.read-btn');
            if (readBtn) {
                const modal = readBtn.closest('.modal');
                const poemText = modal.querySelector('.poem-text-content').textContent;
                readPoem(poemText, readBtn);
            }
        });

        // 复制按钮
        document.addEventListener('click', function(e) {
            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                const modal = copyBtn.closest('.modal');
                const plainText = modal.querySelector('.plain-text').textContent;
                const poemText = modal.querySelector('.poem-text-content').textContent;
                
                const textToCopy = `【白话】${plainText}\n【古诗文】${poemText}`;
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showToast('复制成功！', 'success');
                    })
                    .catch(() => {
                        showToast('复制失败，请手动复制', 'error');
                    });
            }
        });

        // 分享按钮
        document.addEventListener('click', function(e) {
            const shareBtn = e.target.closest('.share-btn');
            if (shareBtn) {
                const modal = shareBtn.closest('.modal');
                const plainText = modal.querySelector('.plain-text').textContent;
                const poemText = modal.querySelector('.poem-text-content').textContent;
                
                if (navigator.share) {
                    navigator.share({
                        title: '诗韵留香',
                        text: `【白话】${plainText}\n【古诗文】${poemText}`,
                        url: window.location.href
                    })
                    .then(() => showToast('分享成功！', 'success'))
                    .catch((error) => showToast('分享失败', 'error'));
                } else {
                    showToast('您的浏览器不支持分享功能', 'info');
                }
            }
        });

        // 收藏夹按钮
        collectionBtn.addEventListener('click', function() {
            appState.showingFavorites = !appState.showingFavorites;
            
            if (appState.showingFavorites) {
                this.classList.add('active');
                showToast('已显示收藏列表', 'info');
            } else {
                this.classList.remove('active');
            }
            
            displayPoems();
        });
    }

    // 执行搜索
    function performSearch() {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            showToast('请输入搜索关键词', 'warning');
            return;
        }
        
        showLoading();
        
        // 重置状态
        appState.showingFavorites = false;
        appState.currentCategory = 'all';
        appState.currentTag = 'all';
        
        // 更新UI
        categoryTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === 'all') {
                tab.classList.add('active');
            }
        });
        
        emotionTags.forEach(tag => {
            tag.classList.remove('active');
            if (tag.dataset.emotion === 'all') {
                tag.classList.add('active');
            }
        });
        
        // 执行搜索并显示结果
        setTimeout(() => {
            const results = window.poemManager.searchPoems(keyword);
            displayPoems(results);
            
            // 显示结果数量
            showToast(`找到 ${results.length} 条结果`, 'info');
        }, 500);
    }

    // 切换收藏状态
    function toggleFavorite(poemId, button) {
        const index = appState.favoritePoems.indexOf(poemId);
        
        if (index === -1) {
            // 添加收藏
            appState.favoritePoems.push(poemId);
            button.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
            button.classList.add('active');
            showToast('已添加到收藏', 'success');
        } else {
            // 取消收藏
            appState.favoritePoems.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart"></i> 收藏';
            button.classList.remove('active');
            showToast('已移出收藏', 'info');
            
            // 如果当前在收藏页面，刷新显示
            if (appState.showingFavorites) {
                displayPoems();
            }
        }
        
        // 保存到本地存储
        saveFavorites();
    }

    // 保存收藏到本地存储
    function saveFavorites() {
        localStorage.setItem('favoritePoems', JSON.stringify(appState.favoritePoems));
    }

    // 从本地存储加载收藏
    function loadFavorites() {
        const favorites = localStorage.getItem('favoritePoems');
        if (favorites) {
            appState.favoritePoems = JSON.parse(favorites);
        }
    }

    // 朗读诗词
    function readPoem(text, button) {
        // 检查浏览器支持
        if (!appState.speechSynthesis) {
            showToast('您的浏览器不支持语音朗读', 'error');
            return;
        }
        
        // 如果正在朗读，则停止
        if (appState.isPlaying) {
            appState.speechSynthesis.cancel();
            button.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
            appState.isPlaying = false;
            return;
        }
        
        // 设置朗读文本
        appState.speechUtterance.text = text;
        
        // 开始朗读
        appState.speechSynthesis.speak(appState.speechUtterance);
        button.innerHTML = '<i class="fas fa-stop"></i> 停止';
        appState.isPlaying = true;
        
        // 朗读结束后恢复按钮
        appState.speechUtterance.onend = function() {
            button.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
            appState.isPlaying = false;
        };
    }

    // 显示提示信息
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon;
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        toast.innerHTML = `${icon} ${message}`;
        toastContainer.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // 关闭模态框
    function closeModal() {
        poemDetailModal.classList.remove('show');
        document.body.style.overflow = '';
        
        // 如果正在朗读，停止朗读
        if (appState.isPlaying) {
            appState.speechSynthesis.cancel();
            const readBtn = poemDetailModal.querySelector('.read-btn');
            readBtn.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
            appState.isPlaying = false;
        }
    }

    // 显示加载中
    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }

    // 隐藏加载中
    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }
}); 