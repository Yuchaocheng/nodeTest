 /* 拖拽功能实现 */
 function dragMain(el, binding) {
     if (binding.value) {
         el.onmousedown = (ev) => {
             /* 针对弹框，只在鼠标点击弹框头部时，让其可拖拽 */
             let header = el.querySelector('header')
             if (!header.contains(ev.target)) {
                 return
             }

             /* 记录鼠标点击位置距离div左边和上边的偏移量 */
             let disX = ev.clientX - el.offsetLeft;
             let disY = ev.clientY - el.offsetTop;
             el.style.cursor = "move"
             document.onmousemove = (ev) => {
                 let left = ev.clientX - disX;
                 let top = ev.clientY - disY;
                 el.style.left = left + 'px';
                 el.style.top = top + 'px';
             };
             document.onmouseup = () => {
                 el.style.cursor = "default"
                 document.onmousemove = null;
                 document.onmouseup = null;
             };
         };
     }
 };
 export default {
     bind(el, binding) {
         dragMain(el, binding);
     },
     /* 当value值改变时 */
     update(el, binding) {
         if (binding.value) {
             if (el.onmousedown) {
                 return
             }
             dragMain(el, binding);
         } else {
             el.onmousedown = null
         }
     },
 }