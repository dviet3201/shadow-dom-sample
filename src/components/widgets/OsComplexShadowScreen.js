import { dynId, mountStyles } from "../../runtime/utils.js";
import "./OsFractalNester.js";
import "./OsShadowMesh.js";
import "./OsMicroFrontendDemo.js";
import "./OsDeepNester.js";
import "./OsIframeNester.js";

customElements.define("os-complex-shadow-screen", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.fractalDepth = 2;
    this.branchingFactor = 2;
    this.mfeDepth = 4;
    this.mfeBranch = 2;
    this.iframeDepth = 3;
    this.iframeBranch = 2;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="screen-container" data-dynid="${dynId("complex-screen")}">
        <header class="screen-header">
          <h1>Extreme Shadow DOM Showcase</h1>
          <p>Demonstrating advanced, highly complex, and non-linear Shadow DOM structures.</p>
        </header>

        <section class="demo-section">
          <h2>1. Fractal Nesting (Exponential Growth)</h2>
          <p class="demo-desc">A recursive component creating a fractal tree of Shadow hosts. Each level branches out, creating massive depth and width.</p>
          
          <div class="controls-panel">
            <div class="control-group">
              <label for="fractal-depth-input">Depth:</label>
              <input type="number" id="fractal-depth-input" min="1" max="8" value="${this.fractalDepth}" />
            </div>
            <div class="control-group">
              <label for="branching-input">Branching Factor:</label>
              <input type="number" id="branching-input" min="2" max="4" value="${this.branchingFactor}" />
            </div>
            <button id="fractal-update-button" class="update-button">Update</button>
          </div>
          
          <div class="demo-card">
            <os-fractal-nester id="fractal-demo" depth="${this.fractalDepth}" branching-factor="${this.branchingFactor}"></os-fractal-nester>
          </div>
        </section>

        <section class="demo-section">
          <h2>2. Top Iframe and Nested Shadow</h2>
          <p class="demo-desc">A non-linear web of Shadow hosts. Clicking a node broadcasts a cross-boundary event that highlights other nodes in the mesh.</p>
          <div class="demo-card">
            <os-shadow-mesh size="4"></os-shadow-mesh>
          </div>
        </section>

        <section class="demo-section">
          <h2>3. Nested Shadow x Iframe</h2>
          <p class="demo-desc">Simulating a micro-frontend architecture where multiple autonomous, encapsulated apps live inside nested iframes, each with its own Shadow DOM.</p>
          
          <div class="controls-panel">
            <div class="control-group">
              <label for="mfe-depth-input">Depth:</label>
              <input type="number" id="mfe-depth-input" min="1" max="20" value="${this.mfeDepth}" />
            </div>
            <div class="control-group">
              <label for="mfe-branch-input">Branch:</label>
              <input type="number" id="mfe-branch-input" min="1" max="5" value="${this.mfeBranch}" />
            </div>
            <button id="mfe-update-button" class="update-button">Update</button>
          </div>
          
          <div class="demo-card">
            <os-micro-frontend-demo id="mfe-demo" branch="${this.mfeBranch}" depth="${this.mfeDepth}" shadow="false"></os-micro-frontend-demo>
          </div>
        </section>

        <section class="demo-section">
          <h2>4. Top Shadow and Nested iFrame Level</h2>
          <p class="demo-desc">A non-linear web of Shadow hosts. Clicking a node broadcasts a cross-boundary event that highlights other nodes in the mesh.</p>
          
          <div class="controls-panel">
            <div class="control-group">
              <label for="iframe-depth-input">Depth:</label>
              <input type="number" id="iframe-depth-input" min="1" max="20" value="${this.iframeDepth}" />
            </div>
            <div class="control-group">
              <label for="iframe-branch-input">Branch:</label>
              <input type="number" id="iframe-branch-input" min="1" max="5" value="${this.iframeBranch}" />
            </div>
            <button id="iframe-update-button" class="update-button">Update</button>
          </div>
          
          <div class="demo-card">
            <os-iframe-nester id="iframe-demo" branch="${this.iframeBranch}" depth="${this.iframeDepth}" label="test"></os-iframe-nester>
          </div>
        </section>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      .screen-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .screen-header {
        margin-bottom: 32px;
        border-bottom: 1px solid var(--os-border-soft);
        padding-bottom: 16px;
      }
      .screen-header h1 {
        margin: 0;
        font-size: 2.5rem;
        color: var(--os-text);
      }
      .screen-header p {
        color: var(--os-text-secondary);
        margin-top: 8px;
        font-size: 1.1rem;
      }
      .demo-section {
        margin-bottom: 64px;
      }
      .demo-section h2 {
        font-size: 1.8rem;
        margin-bottom: 8px;
        color: var(--os-text);
      }
      .demo-desc {
        font-size: 0.95rem;
        color: var(--os-text-secondary);
        margin-bottom: 20px;
      }
      .controls-panel {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #ddd;
      }
      .control-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .control-group label {
        font-weight: bold;
        font-size: 14px;
        min-width: 100px;
      }
      .control-group input {
        width: 60px;
        padding: 6px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
      }
      .control-value {
        font-size: 14px;
        color: #666;
        min-width: 30px;
      }
      .update-button {
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
      }
      .update-button:hover {
        background: #0056b3;
      }
      .update-button:active {
        background: #004494;
      }
      .demo-card {
        background: var(--os-card);
        border: 1px solid var(--os-border-soft);
        border-radius: var(--os-radius);
        padding: 32px;
        box-shadow: var(--os-shadow-lg);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }
      .demo-card os-micro-frontend-demo {
        display: block;
        width: 100%;
        height: 100%;
        flex: 1;
      }
      .demo-card os-fractal-nester {
        display: block;
        width: 100%;
        height: 100%;
      }
      .demo-card os-shadow-mesh {
        display: block;
        width: 100%;
        height: 100%;
      }
    `);

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Fractal Nester Controls
    const fractalDepthInput = this.shadowRoot.getElementById("fractal-depth-input");
    const branchingInput = this.shadowRoot.getElementById("branching-input");
    const fractalUpdateButton = this.shadowRoot.getElementById("fractal-update-button");

    fractalDepthInput?.addEventListener("change", (e) => {
      this.fractalDepth = parseInt(e.target.value, 10) || 1;
    });

    branchingInput?.addEventListener("change", (e) => {
      this.branchingFactor = parseInt(e.target.value, 10) || 2;
    });

    fractalUpdateButton?.addEventListener("click", () => {
      this.updateFractalNester();
    });



    fractalDepthInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.fractalDepth = parseInt(fractalDepthInput.value, 10) || 1;
        this.updateFractalNester();
      }
    });

    
    branchingInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.branchingFactor = parseInt(branchingInput.value, 10) || 2;
        this.updateFractalNester();
      }
    });

    // Micro-Frontend Demo Controls
    const mfeDepthInput = this.shadowRoot.getElementById("mfe-depth-input");
    const mfeBranchInput = this.shadowRoot.getElementById("mfe-branch-input");
    const mfeUpdateButton = this.shadowRoot.getElementById("mfe-update-button");

    mfeDepthInput?.addEventListener("change", (e) => {
      this.mfeDepth = parseInt(e.target.value, 10) || 1;
    });

    mfeBranchInput?.addEventListener("change", (e) => {
      this.mfeBranch = parseInt(e.target.value, 10) || 1;
    });

    mfeUpdateButton?.addEventListener("click", () => {
      this.updateMicroFrontendDemo();
    });

    mfeDepthInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.mfeDepth = parseInt(mfeDepthInput.value, 10) || 1;
        this.updateMicroFrontendDemo();
      }
    });

    mfeBranchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.mfeBranch = parseInt(mfeBranchInput.value, 10) || 1;
        this.updateMicroFrontendDemo();
      }
    });

    // iFrame Nester Controls
    const iframeDepthInput = this.shadowRoot.getElementById("iframe-depth-input");
    const iframeBranchInput = this.shadowRoot.getElementById("iframe-branch-input");
    const iframeUpdateButton = this.shadowRoot.getElementById("iframe-update-button");
    iframeDepthInput?.addEventListener("change", (e) => {
      this.iframeDepth = parseInt(e.target.value, 10) || 1;
    });
    iframeBranchInput?.addEventListener("change", (e) => {
      this.iframeBranch = parseInt(e.target.value, 10) || 1;
    });
    iframeUpdateButton?.addEventListener("click", () => {
      this.updateIframeNester();
    }); 
  }

  updateFractalNester() {
    const fractalDemo = this.shadowRoot.getElementById("fractal-demo");
    if (fractalDemo) {
      fractalDemo.setAttribute("depth", this.fractalDepth);
      fractalDemo.setAttribute("branching-factor", this.branchingFactor);
    }
    this.render();
  }

  updateIframeNester() {
    const iframeDemo = this.shadowRoot.getElementById("iframe-demo");
    if (iframeDemo) {
      iframeDemo.setAttribute("depth", this.iframeDepth);
      iframeDemo.setAttribute("branch", this.iframeBranch);
    }
  }
  updateMicroFrontendDemo() {
    const mfeDemo = this.shadowRoot.getElementById("mfe-demo");
    if (mfeDemo) {
      mfeDemo.setAttribute("depth", this.mfeDepth);
      mfeDemo.setAttribute("branch", this.mfeBranch);
    }
  }
});