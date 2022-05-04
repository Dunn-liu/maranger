import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/commont.css'
import router from './router/index'
import store from './store/index'
import 'dayjs/locale/zh-cn'
// markdown编辑器
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
// github 主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// vue 主题
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// 表情
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';
import hljs from 'highlight.js';
import '@/styles/index.scss'
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';

VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme,{
    })
    .use(vuepressTheme,{
        codeHighlightExtensionMap: {
            vue: 'xml',
        }
    })
    .use(createEmojiPlugin());

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
createApp(App)
  .use(router).use(store).use(VMdEditor).use(VMdPreview)
  .mount('#app')
