class UITooltip extends HTMLElement {
  static get observedAttributes() {
    return ["content", "position", "max-width"]
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._show = this._show.bind(this)
    this._hide = this._hide.bind(this)
    this._position = "bottom"
    this._content = ""
    this._maxWidth = "450px" // 默认最大宽度
    this._delay = 100
    this._timeout = null
    this._tooltipContainer = null
  }

  connectedCallback() {
    this._render()
    this._setupEvents()
  }

  disconnectedCallback() {
    this._cleanupEvents()
    // 移除全局tooltip容器
    this._removeGlobalTooltip()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "content" && this._tooltipContainer) {
      this._content = newValue
      const tooltipContent = this._tooltipContainer.querySelector(".tooltip-content")
      if (tooltipContent) tooltipContent.innerHTML = newValue
    }
    if (name === "position") {
      this._position = newValue || "top"
      if (this._tooltipContainer) this._updatePosition()
    }
    if (name === "max-width" && this._tooltipContainer) {
      this._maxWidth = newValue || "450px"
      const tooltipContent = this._tooltipContainer.querySelector(".tooltip-content")
      if (tooltipContent) tooltipContent.style.maxWidth = this._maxWidth
    }
  }

  _render() {
    this._position = this.getAttribute("position") || "top"
    this._content = this.getAttribute("content") || ""
    this._maxWidth = this.getAttribute("max-width") || "450px"

    // 打印属性值，用于调试
    console.log(`UITooltip attributes: position=${this._position}, max-width=${this._maxWidth}`)

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        
        :host([hidden]) {
          display: none;
        }
      </style>
      
      <slot></slot>
    `
  }

  _createGlobalTooltip() {
    // 如果已经存在全局tooltip，则返回
    if (this._tooltipContainer) return

    // 重新获取最新的属性值
    this._position = this.getAttribute("position") || this._position
    this._maxWidth = this.getAttribute("max-width") || this._maxWidth

    // 打印属性值，用于调试
    console.log(`Creating tooltip with: position=${this._position}, max-width=${this._maxWidth}`)

    // 创建全局tooltip容器
    this._tooltipContainer = document.createElement("div")
    this._tooltipContainer.className = "ui-tooltip-container"
    this._tooltipContainer.style.cssText = `
      position: fixed;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
    `

    // 创建tooltip内容和箭头
    const tooltipContent = document.createElement("div")
    tooltipContent.className = "tooltip-content"
    tooltipContent.style.cssText = `
      min-width: 50px;
      max-width: ${this._maxWidth};
      padding: 6px 8px;
      color: #fff;
      text-align: left;
      text-decoration: none;
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-word;
      background-color: rgba(0, 0, 0, 0.85);
      border-radius: 2px;
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    `
    tooltipContent.innerHTML = this._content

    const tooltipArrow = document.createElement("div")
    tooltipArrow.className = "tooltip-arrow"
    tooltipArrow.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(0, 0, 0, 0.85);
      transform: rotate(45deg);
    `

    // 组装tooltip
    this._tooltipContainer.appendChild(tooltipContent)
    this._tooltipContainer.appendChild(tooltipArrow)
    document.body.appendChild(this._tooltipContainer)
  }

  _removeGlobalTooltip() {
    if (this._tooltipContainer && this._tooltipContainer.parentNode) {
      this._tooltipContainer.parentNode.removeChild(this._tooltipContainer)
      this._tooltipContainer = null
    }
  }

  _setupEvents() {
    this.addEventListener("mouseenter", this._show)
    this.addEventListener("mouseleave", this._hide)
    this.addEventListener("focusin", this._show)
    this.addEventListener("focusout", this._hide)
  }

  _cleanupEvents() {
    this.removeEventListener("mouseenter", this._show)
    this.removeEventListener("mouseleave", this._hide)
    this.removeEventListener("focusin", this._show)
    this.removeEventListener("focusout", this._hide)
  }

  _show() {
    clearTimeout(this._timeout)
    this._timeout = setTimeout(() => {
      // 创建全局tooltip
      this._createGlobalTooltip()

      // 更新位置并显示
      this._updatePosition()
      this._tooltipContainer.style.opacity = "1"
    }, this._delay)
  }

  _hide() {
    clearTimeout(this._timeout)
    if (this._tooltipContainer) {
      this._tooltipContainer.style.opacity = "0"
    }
  }

  _updatePosition() {
    console.log("updatePosition");
    
    if (!this._tooltipContainer) return

    const content = this._tooltipContainer.querySelector(".tooltip-content")
    const arrow = this._tooltipContainer.querySelector(".tooltip-arrow")

    if (!content || !arrow) return

    // 重置样式
    this._tooltipContainer.style.left = ""
    this._tooltipContainer.style.right = ""
    this._tooltipContainer.style.top = ""
    this._tooltipContainer.style.bottom = ""
    arrow.style.left = ""
    arrow.style.right = ""
    arrow.style.top = ""
    arrow.style.bottom = ""

    // 获取宿主元素的位置
    const hostRect = this.getBoundingClientRect()

    // 打印位置信息，用于调试
    console.log(`Host element rect: top=${hostRect.top}, bottom=${hostRect.bottom}, left=${hostRect.left}, right=${hostRect.right}`)
    console.log(`Using position: ${this._position}`)

    // 计算位置 - 使用固定定位，相对于视口
    switch (this._position) {
      case "top":
        this._tooltipContainer.style.bottom = `${window.innerHeight - hostRect.top + 8}px`
        this._tooltipContainer.style.left = `${hostRect.left + hostRect.width / 2}px`
        this._tooltipContainer.style.transform = "translateX(-50%)"
        arrow.style.bottom = "-4px"
        arrow.style.left = "50%"
        arrow.style.transform = "translateX(-50%) rotate(45deg)"
        break

      case "right":
        this._tooltipContainer.style.left = `${hostRect.right + 8}px`
        this._tooltipContainer.style.top = `${hostRect.top + hostRect.height / 2}px`
        this._tooltipContainer.style.transform = "translateY(-50%)"
        arrow.style.left = "-4px"
        arrow.style.top = "50%"
        arrow.style.transform = "translateY(-50%) rotate(45deg)"
        break

      case "bottom":
        this._tooltipContainer.style.top = `${hostRect.bottom + 8}px`
        this._tooltipContainer.style.left = `${hostRect.left + hostRect.width / 2}px`
        this._tooltipContainer.style.transform = "translateX(-50%)"
        arrow.style.top = "-4px"
        arrow.style.left = "50%"
        arrow.style.transform = "translateX(-50%) rotate(45deg)"
        console.log(`Set tooltip position to bottom: top=${this._tooltipContainer.style.top}, left=${this._tooltipContainer.style.left}`)
        break

      case "left":
        this._tooltipContainer.style.right = `${window.innerWidth - hostRect.left + 8}px`
        this._tooltipContainer.style.top = `${hostRect.top + hostRect.height / 2}px`
        this._tooltipContainer.style.transform = "translateY(-50%)"
        arrow.style.right = "-4px"
        arrow.style.top = "50%"
        arrow.style.transform = "translateY(-50%) rotate(45deg)"
        break
    }

    // 检查是否超出视口，如果是则调整位置
    this._adjustToViewport()
  }

  _adjustToViewport() {
    if (!this._tooltipContainer) return

    const content = this._tooltipContainer.querySelector(".tooltip-content")
    if (!content) return

    // 获取当前位置和尺寸
    const tooltipRect = content.getBoundingClientRect()

    // 检查是否超出视口右侧
    if (tooltipRect.right > window.innerWidth) {
      const overflow = tooltipRect.right - window.innerWidth
      const currentLeft = parseFloat(this._tooltipContainer.style.left) || 0
      this._tooltipContainer.style.left = `${currentLeft - overflow - 10}px`
    }

    // 检查是否超出视口左侧
    if (tooltipRect.left < 0) {
      const overflow = -tooltipRect.left
      const currentLeft = parseFloat(this._tooltipContainer.style.left) || 0
      this._tooltipContainer.style.left = `${currentLeft + overflow + 10}px`
    }

    // 检查是否超出视口底部
    if (tooltipRect.bottom > window.innerHeight) {
      // 如果是底部位置，则切换到顶部
      if (this._position === "bottom") {
        const hostRect = this.getBoundingClientRect()
        this._tooltipContainer.style.top = ""
        this._tooltipContainer.style.bottom = `${window.innerHeight - hostRect.top + 8}px`

        const arrow = this._tooltipContainer.querySelector(".tooltip-arrow")
        if (arrow) {
          arrow.style.top = ""
          arrow.style.bottom = "-4px"
        }
      }
    }

    // 检查是否超出视口顶部
    if (tooltipRect.top < 0) {
      // 如果是顶部位置，则切换到底部
      if (this._position === "top") {
        const hostRect = this.getBoundingClientRect()
        this._tooltipContainer.style.bottom = ""
        this._tooltipContainer.style.top = `${hostRect.bottom + 8}px`

        const arrow = this._tooltipContainer.querySelector(".tooltip-arrow")
        if (arrow) {
          arrow.style.bottom = ""
          arrow.style.top = "-4px"
        }
      }
    }
  }
}

customElements.define("ui-tooltip", UITooltip)
