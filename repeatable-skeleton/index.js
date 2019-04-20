function _cloneArray(arr) { 
  if (Array.isArray(arr)) { 
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { 
      arr2[i] = arr[i]; 
    } 
    return arr2; 
  } else { 
    return Array.from(arr); 
  } 
}

( function( wp ) {
  /**
   * Registers a new block provided a unique name and an object defining its behavior.
   * @see https://github.com/WordPress/gutenberg/tree/master/blocks#api
   */
  var registerBlockType = wp.blocks.registerBlockType;
  /**
   * Returns a new element of given type. Element is an abstraction layer atop React.
   * @see https://github.com/WordPress/gutenberg/tree/master/element#element
   */
  var el = wp.element.createElement;
  /**
   * Retrieves the translation of text.
   * @see https://github.com/WordPress/gutenberg/tree/master/i18n#api
   */
  var __ = wp.i18n.__;

  var RichText = wp.editor.RichText;
  var MediaUpload = wp.editor.MediaUpload;
  var components = wp.components;

  /**
   * Every block starts by registering a new block type definition.
   * @see https://wordpress.org/gutenberg/handbook/block-api/
   */
  registerBlockType( 'gutenberg/repeatable-skeleton', {
    /**
     * This is the display title for your block, which can be translated with `i18n` functions.
     * The block inserter will show this name.
     */
    title: __( 'repeatable-skeleton' ),

    /**
     * Blocks are grouped into categories to help users browse and discover them.
     * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
     */
    category: 'widgets',

    /**
     * Optional block extended support features.
     */
    supports: {
      // Removes support for an HTML mode.
      html: false,
    },


    attributes: {
      items: {        
        source: 'query',
        default: [],
        selector: '.item',
        query: {
          title: {
            type: 'string',
            source: 'text',
            selector: '.title'
          },
          index: {            
            type: 'number',
            source: 'attribute',
            attribute: 'data-index'            
          }           
        }
      }       
    },

    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     * @see https://wordpress.org/gutenberg/handbook/block-edit-save/#edit
     *
     * @param {Object} [props] Properties passed from the editor.
     * @return {Element}       Element to render.
     */
    edit: function( props ) {

      var attributes = props.attributes;

      var itemList = attributes.items.sort(function(a , b) {
        return a.index - b.index;
      }).map(function(item){          
        return el('div', { className: 'item' },        
            el( RichText, {                
            tagName: 'h1',
            placeholder: 'Here the title goes...',                
            value: item.title,
            autoFocus: true,
            onChange: function( value ) {                                
              var newObject = Object.assign({}, item, {
                title: value
              });
              return props.setAttributes({
                items: [].concat(_cloneArray(props.attributes.items.filter(function (itemFilter) {
                  return itemFilter.index != item.index;
                })), [newObject])
              });
            }
          }            
        ),
        el( components.Button, {
            className: 'button remove-row',            
            onClick: function() {              
              var newItems = props.attributes.items.filter(function (itemFilter) {
                return itemFilter.index != item.index;
              }).map(function (itemMap) {
                if (itemMap.index > item.index) {
                  itemMap.index -= 1;
                }

                return itemMap;
              });

              props.setAttributes({
                items: newItems
              });

            }
          },
          'Remove Row'
        ),
        el( components.Button, {
            className: 'button',            
            onClick: function() {
              
              if (props.attributes.items.length < 2 || item.index == 0) return;
              
              var currentIndex = parseInt(item.index);
              var newItems = _cloneArray(props.attributes.items);              
              var helper = newItems[currentIndex];
              newItems[currentIndex] = newItems[currentIndex - 1];
              newItems[currentIndex - 1] = helper;

              newItems.map(function(itemMap, index) {
                return itemMap.index = index;
              });

              props.setAttributes({
                items: newItems
              });

            }
          },
          'Move Up'
        ),
        el( components.Button, {
            className: 'button',            
            onClick: function() {                            

              console.log('Move Down');

              if (props.attributes.items.length < 2 || item.index == props.attributes.items.length - 1) return;

              var currentIndex = parseInt(item.index);
              var newItems = _cloneArray(props.attributes.items);              
              var helper = newItems[currentIndex];
              newItems[currentIndex] = newItems[currentIndex + 1];
              newItems[currentIndex + 1] = helper;

              newItems.map(function(itemMap, index) {
                return itemMap.index = index;
              });

              props.setAttributes({
                items: newItems
              });

            }
          },
          'Move Down'
        ))
      });       

      return el(
        'div',
        { className: props.className },
        el('div', { className: 'item-list' },        
          itemList,
        ),
        el( components.Button, {
            className: 'button add-row',            
            onClick: function() {              
              return props.setAttributes({
                items: [].concat(_cloneArray(props.attributes.items), [{
                  index: props.attributes.items.length,                  
                  title: ""                  
                }])
              });                            
            }
          },
          'Add Row'
        )        
      );            
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into `post_content`.
     * @see https://wordpress.org/gutenberg/handbook/block-edit-save/#save
     *
     * @return {Element}       Element to render.
     */
    save: function( props ) {

      var attributes = props.attributes;            

      if (attributes.items.length > 0) {

        var itemList = attributes.items.map(function(item) {          
        
          return el('div', { className: 'item', 'data-index': item.index },        
            el( 'h1', {              
              className: 'title',                                 
            }, item.title)            
          );

        });

        return el(
          'div',
          { className: props.className },
          el('div', { className: 'item-list' },        
            itemList
          )              
        ); 

      } else {
        return null;
      }
    }
  } );
} )(
  window.wp
);
