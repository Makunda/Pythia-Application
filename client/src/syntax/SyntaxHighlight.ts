import Vue from "vue";
import VueHighlightJS from 'vue-highlight.js';
import hljs from 'highlight.js/lib/core';

import 'highlight.js/styles/darcula.css';

Vue.use (VueHighlightJS);
const hljsCypher = require ('highlightjs-cypher');
hljs.registerLanguage ("cypher", hljsCypher);
