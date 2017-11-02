/**
 * @authors: Önder Ceylan <onderceylan@gmail.com>, PPKRAUSS https://github.com/ppKrauss
 * @license Licensed under the terms of GPL, LGPL and MPL licenses.
 * @version 1.1
 * @history v1.0 at 2013-05-09 by onderceylan, v1.1 at 2013-08-27 by ppkrauss.
 */

CKEDITOR.plugins.add('texttransform',
    {

        lang: 'en,tr,fr',

        init: function (editor) {
            // baş harfleri büyütmenin counteri
            var num = 0;

            // seçili texti çevirir
            var transformSelectedText = function (editor, transformFunc) {

                var selection = editor.getSelection();
                if (selection.getSelectedText().length > 0) {

                    var range = selection.getRanges()[0],
                        walker = new CKEDITOR.dom.walker(range),
                        node,
                        nodeText;

                    while ((node = walker.next())) {

                        if (node.type == CKEDITOR.NODE_TEXT && node.getText()) {

                            nodeText = node.$.textContent;
                            // walkerda html taglerinin içinde geziyor, eğer tag yani node, seçtiğim textleri kapsıyorsa bu if e giriyor ve rangin offsetleri arasında işlem yapıp çıkıyorumç
                            if (node.equals(range.startContainer) && node.equals(range.endContainer)) {
                                nodeText = nodeText.substr(0, range.startOffset)
                                    + transformFunc(nodeText.substr(range.startOffset, range.endOffset - range.startOffset))
                                    + nodeText.substr(range.endOffset);
                            }
                            // node lar arasında gezerken bulunduğum node, seçtiğim range nin başlangıcını kapsıyor bitişini kapsamıyorsa
                            else if (node.equals(range.startContainer)) {

                                nodeText = nodeText.substr(0, range.startOffset) +
                                    transformFunc(nodeText.substr(range.startOffset));
                            }
                            //node lar arasında gezerken bulunduğum node, seçtiğim range nin bitişini kapsıyor başlangıcını kapsamıyorsa
                            else if (node.equals(range.endContainer)) {

                                nodeText = transformFunc(nodeText.substr(0, range.endOffset)) +
                                    nodeText.substr(range.endOffset);
                            }
                            else {
                            // bulunduğum node start yada end değil aradaki node larsa onları kafadan çeviriyoruz..
                                nodeText = transformFunc(nodeText);
                            }

                            node.$.textContent = nodeText;
                        }
                    }
                }
                selection.selectRanges([range]);		//seçtiğim alanın highlight olarak kalmasını sağlıyorum.
            }


            editor.addCommand('transformTextSwitch',
                {
                    exec: function () {
                        var selection = editor.getSelection();
                        var commandArray = ['transformTextToUppercase', 'transformTextToLowercase', 'transformTextCapitalize'];

                        if (selection.getSelectedText().length > 0) {

                            selection.lock();

                            editor.execCommand(commandArray[num]);

                            selection.unlock(true);

                            if (num < commandArray.length - 1) {
                                num++;
                            } else {
                                num = 0;
                            }

                        }
                    }
                });

            editor.addCommand('transformTextToUppercase',
                {
                    exec: function () {
                        transformSelectedText(editor, function (text) {
                            return text.trToUpperCase();
                        });
                    }
                });

            editor.addCommand('transformTextToLowercase',
                {
                    exec: function () {
                        transformSelectedText(editor, function (text) {
                            return text.trToLowerCase();

                        });
                    }
                });

            editor.addCommand('transformTextCapitalize',
                {
                    exec: function () {
                        transformSelectedText(editor, function (text) {

                            return text.replace(/[^\s]\S*/g,
                                function (word) {
                                    return word.charAt(0).trToUpperCase() +
                                        word.substr(1).trToLowerCase();
                                }
                            );
                        });
                    }
                });

            editor.ui.addButton('TransformTextSwitcher',
                {
                    label: editor.lang.texttransform.transformTextSwitchLabel,
                    command: 'transformTextSwitch',
                    icon: this.path + 'images/transformSwitcher.png'
                });

            editor.ui.addButton('TransformTextToLowercase',
                {
                    label: editor.lang.texttransform.transformTextToLowercaseLabel,
                    command: 'transformTextToLowercase',
                    icon: this.path + 'images/transformToLower.png'
                });

            editor.ui.addButton('TransformTextToUppercase',
                {
                    label: editor.lang.texttransform.transformTextToUppercaseLabel,
                    command: 'transformTextToUppercase',
                    icon: this.path + 'images/transformToUpper.png'
                });

            editor.ui.addButton('TransformTextCapitalize',
                {
                    label: editor.lang.texttransform.transformTextCapitalizeLabel,
                    command: 'transformTextCapitalize',
                    icon: this.path + 'images/transformCapitalize.png'
                });
        }
    });

