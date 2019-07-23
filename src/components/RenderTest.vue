<script>
export default {
  props: ['level'],
  /* 渲染一个元素 */
  render(createElement) {
    return createElement(
      'div', {
        // class: {
        //   child1: true,
        //   more: true
        // },
        class: "child",
        attrs: {
          id: 'foo',
          name: 'child'
        },
        style: {
          width: '100%',
          // height: '50px'
        },
        /* 如果这里写了innerHTML就会把里面的标签替换掉了，子元素就出不来了 */
        // domProps: {
        //   innerHTML: "child-innerHTML"
        // }
      },
      [
        createElement('h1', '标题'),
        createElement('h2', {
          attrs: { id: 'child-h2' },
          class: 'child-h2-more',
          style: {
            width: '100%',
            height: "50px"
          },
          domProps: {
            innerHTML: 'h2'
          }
        }
        ),
      ]
    )
  },
  // render(createElement) {
  //   return createElement(
  //     'div', {
  //       class: 'child',
  //       style: {
  //         width: '100%'
  //       },
  //     }, [
  //       createElement('h1', '标题'),
  //       createElement('h2', {
  //         attrs: {
  //           id: 'child-h2'
  //         },
  //         class: 'more',
  //         style: {
  //           width: '100%',
  //           height: '50px'
  //         },
  //         domProps: {
  //           innerHTML: 'h2'
  //         }
  //       }),
  //     ]
  //   )
  // }
}
</script>

<style scoped>
.child {
  background: pink;
}
.child-h2-more {
  background: red;
}
</style>
