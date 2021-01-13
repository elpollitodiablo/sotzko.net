const html = (content) => {
    return content;
};

export const TAG_NAME = 'reddit-top-of-the-day';

export class RedditTopOfTheDayComponent extends HTMLElement {
    constructor() {
        super();

        this.subreddit = null;

        this._top = null;
    }

    /* WC Hooks */
    connectedCallback() {
        this.innerHTML = html`<h1>alive!</h1>`;
        this._fetchTopPost();
    }

    static get observedAttributes() {
        return ['subreddit'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
    /* Private */

    _fetchTopPost() {
        fetch(`https://api.reddit.com/r/${this.subreddit}/hot/`)
            .then((res) => res.json())
            .then((res) => {
                this._findTopImagePost(res.data);
                this._render();
            });
    }

    _findTopImagePost(data) {
        data.children.forEach((post) => {
            if (!this._top || post.data.score > this._top.data.score) {
                this._top = post;
            }
        });
    }

    _render() {
        this.innerHTML = `
            <div class="reddit-top-of-the-day">
                <a href="https://www.reddit.com/${this._top.data.permalink}" target="_blank" rel="noopener noreferrer">
                    <img src="${this._top.data.url}" alt="${this._top.data.title}" style="max-width:100%" />
                </a>
            </div>
        `;
    }

    /* Static */

    static register() {
        if (!customElements.get(TAG_NAME)) {
            customElements.define(TAG_NAME, RedditTopOfTheDayComponent);
        }
    }
}
