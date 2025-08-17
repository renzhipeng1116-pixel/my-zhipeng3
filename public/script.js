// 页面状态管理
class PageStateManager {
    constructor() {
        this.initialState = document.getElementById('initialState');
        this.loadingState = document.getElementById('loadingState');
        this.resultState = document.getElementById('resultState');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyAndOpenBtn = document.getElementById('copyAndOpenBtn');
        this.reviewText = document.getElementById('reviewText');
        
        // 选择状态
        this.selectedCrowd = null;
        this.selectedDishes = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupReviewTextEditing();
        this.setupSelectionButtons();
    }
    
    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.handleGenerateReview());
        this.copyAndOpenBtn.addEventListener('click', () => this.handleCopyAndOpen());
    }
    
    // 设置选择按钮
    setupSelectionButtons() {
        // 就餐人群选择（单选）
        const crowdButtons = document.querySelectorAll('#crowdGroup .selection-btn');
        crowdButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除其他选中状态
                crowdButtons.forEach(b => b.classList.remove('selected'));
                // 添加当前选中状态
                btn.classList.add('selected');
                this.selectedCrowd = btn.dataset.value;
                this.checkGenerateButton();
            });
        });
        
        // 特色菜选择（多选）
        const dishButtons = document.querySelectorAll('#dishGroup .selection-btn');
        dishButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                if (btn.classList.contains('selected')) {
                    this.selectedDishes.push(btn.dataset.value);
                } else {
                    this.selectedDishes = this.selectedDishes.filter(dish => dish !== btn.dataset.value);
                }
                this.checkGenerateButton();
            });
        });
    }
    
    // 检查生成按钮状态
    checkGenerateButton() {
        if (this.selectedCrowd && this.selectedDishes.length > 0) {
            this.generateBtn.disabled = false;
            this.generateBtn.style.opacity = '1';
        } else {
            this.generateBtn.disabled = true;
            this.generateBtn.style.opacity = '0.6';
        }
    }
    
    // 显示初始状态
    showInitialState() {
        this.initialState.style.display = 'block';
        this.loadingState.style.display = 'none';
        this.resultState.style.display = 'none';
    }
    
    // 显示加载状态
    showLoadingState() {
        this.initialState.style.display = 'none';
        this.loadingState.style.display = 'block';
        this.resultState.style.display = 'none';
    }
    
    // 显示结果状态
    showResultState() {
        this.initialState.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.resultState.style.display = 'block';
    }
    
    // 处理生成好评
    async handleGenerateReview() {
        try {
            this.showLoadingState();
            this.generateBtn.disabled = true;
            
            // 模拟AI生成过程（实际项目中这里会调用真实的AI API）
            const review = await this.generateAIReview();
            
            this.reviewText.value = review;
            this.showResultState();
            
        } catch (error) {
            console.error('生成好评失败:', error);
            this.showError('生成失败，请重试');
            this.showInitialState();
        } finally {
            this.generateBtn.disabled = false;
        }
    }
    
    // 生成AI好评（使用DeepSeek API）
    async generateAIReview() {
        try {
            const merchantName = document.querySelector('.merchant-name').textContent;
            
            // 构建提示词
            const prompt = `请为"${merchantName}"生成一段真诚、生动的好评。要求：
            
就餐场景：${this.selectedCrowd}
已点特色菜：${this.selectedDishes.join('、')}

请生成一段100-150字的好评，要求：
1. 语言生动自然，有具体细节描述
2. 体现就餐场景的特点
3. 突出特色菜的美味
4. 表达对服务的满意
5. 语言亲切友好，符合真实顾客评价风格

请直接输出好评内容，不要加任何解释。`;

            // 调用DeepSeek API
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-30747bae1645410ebe2c071e4d2cb9ea'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的餐饮评价生成助手，擅长生成真诚、生动、个性化的餐厅好评。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    stream: false,
                    max_tokens: 500,
                    temperature: 0.8
                })
            });

            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }

            const data = await response.json();
            const review = data.choices[0].message.content.trim();
            
            return review || this.getFallbackReview(merchantName);
            
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            // 如果API调用失败，使用备用模板
            const merchantName = document.querySelector('.merchant-name').textContent;
            return this.getFallbackReview(merchantName);
        }
    }
    
    // 备用好评模板
    getFallbackReview(merchantName) {
        const crowdTemplates = {
            '独自吃饭': `今天一个人来${merchantName}用餐，没想到体验这么棒！服务员很贴心，推荐了适合一个人的份量。`,
            '和朋友吃饭': `和朋友们一起来${merchantName}聚餐，气氛超级好！大家都很满意这里的服务和菜品。`,
            '和家人吃饭': `带着家人来${merchantName}，老人孩子都很喜欢这里的环境和口味，很温馨的家庭时光。`,
            '商务宴请': `在${merchantName}接待客户，环境优雅，服务专业，给足了面子，客户很满意。`
        };
        
        const crowdText = crowdTemplates[this.selectedCrowd] || `在${merchantName}用餐`;
        const dishText = this.selectedDishes.length > 0 ? `，特别是${this.selectedDishes.join('、')}，味道真的很棒！` : '，菜品质量很高！';
        
        return `${crowdText}的体验非常棒${dishText}服务态度很好，环境也很舒适，下次还会再来，强烈推荐给大家！`;
    }
    
    // 处理复制并打开应用
    async handleCopyAndOpen() {
        try {
            const reviewText = this.reviewText.value;
            
            // 复制到剪贴板
            await navigator.clipboard.writeText(reviewText);
            
            // 显示成功提示
            this.showSuccess('好评已复制到剪贴板！');
            
            // 尝试打开点评应用（这里以美团为例）
            this.openReviewApp();
            
        } catch (error) {
            console.error('复制失败:', error);
            this.showError('复制失败，请手动复制');
        }
    }
    
    // 打开点评应用
    openReviewApp() {
        // 尝试打开大众点评应用
        const dianpingUrl = 'dianping://';
        const dianpingWebUrl = 'https://www.dianping.com/';
        
        // 尝试打开应用，如果失败则打开网页版
        window.location.href = dianpingUrl;
        
        // 延迟后如果还在当前页面，则打开网页版
        setTimeout(() => {
            if (document.hidden || document.webkitHidden) {
                return; // 如果页面已经隐藏，说明可能已经跳转
            }
            window.open(dianpingWebUrl, '_blank');
        }, 1000);
    }
    
    // 设置评价文本编辑功能
    setupReviewTextEditing() {
        this.reviewText.addEventListener('click', () => {
            this.reviewText.readOnly = false;
            this.reviewText.focus();
        });
        
        this.reviewText.addEventListener('blur', () => {
            this.reviewText.readOnly = true;
        });
    }
    
    // 显示成功提示
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    // 显示错误提示
    showError(message) {
        this.showToast(message, 'error');
    }
    
    // 显示提示信息
    showToast(message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInDown 0.3s ease-out'
        });
        
        document.body.appendChild(toast);
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOutUp 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new PageStateManager();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加触摸反馈
document.addEventListener('touchstart', function() {}, {passive: true});

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 添加页面可见性检测
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时的处理
        console.log('页面已隐藏');
    } else {
        // 页面显示时的处理
        console.log('页面已显示');
    }
});
