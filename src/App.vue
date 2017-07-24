<template>
    <div id="app" class="heightH">
        <el-row class="heightH">
            <el-col :span="6" class="border">
                <div class="">
                    <div class="head">机构列表</div>
                    <div class="grid-content bg-purple h300">
                        <el-tree :indent="10" :data="jgData" highlight-current :props="defaultProps" :expand-on-click-node="false" @load="childLoad" @node-click="jghandleNodeClick" @node-expand="nodeExpand"></el-tree>
                    </div>
                </div>
                <div v-show="targetMode>1">
                    <div class="head">部门列表</div>
                    <div class="grid-content bg-purple h300">
                        <el-tree :data="bmData" highlight-current :props="defaultProps" :expand-on-click-node="false" @node-click="buNodeClick" @node-expand="bmNodeExpand"></el-tree>
                    </div>
                </div>
                <div v-show="targetMode>2">
                    <div class="head">
                        <span>人员列表</span>
                    </div>
                    <div class="flex fHead">
                        <!-- <div class="half">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div> -->
                        <div class="half">
                            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                            </el-input>
                        </div>
                    </div>
                    <div class="grid-content bg-purple h300">
                        <el-tree :data="ryData" ref="ryTree" highlight-current :props="rydefaultProps" @node-click="ryhandleNodeClick" :filter-node-method="filterNode"></el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="grid-content bg-purple-light boxOut">
                    <div class="articleHandleBox flex">
                        <div class="marginL20">
                            <span class="demonstration">启用日期</span>
                            <el-date-picker v-model="startTime" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                        <div class="buttonArea">
                            <el-button type="primary" size="large" @click="save">保存</el-button>
                            <el-button type="primary" size="large" @click="dialogVisible = true">预览</el-button>
                        </div>
                    </div>
                    <div>
                        <quill-editor id="myTextEditor" ref="myTextEditor" v-model="content" :options="editorOption" @change="oneEditorChange($event)">
                        </quill-editor>
                        <input class="hide" type="file" id="getFile" @change="uploadFunction($event)" />
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="预览" :visible.sync="dialogVisible" size="tiny" top=true>
            <div class="mobileBox">
                <div class="html ql-editor" v-html="content"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    quillEditor
} from 'vue-quill-editor'; // 导入quillEditor组件

export default {
    data() {
            return {
                targetMode:3,//3:人员;2:部门;1:机构
                dialogVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'text',
                },
                rydefaultProps: {
                    children: 'children',
                    label: 'xm',
                },
                dialogVisible: false,
                type: '',
                id: '',
                content: '', // 编辑器的内容
                editorOption: { // 编辑器的配置
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                                ['blockquote', 'code-block'],

                                [{
                                    'header': 1
                                }, {
                                    'header': 2
                                }], // custom button values
                                [{
                                    'list': 'ordered'
                                }, {
                                    'list': 'bullet'
                                }],
                                [{
                                    'script': 'sub'
                                }, {
                                    'script': 'super'
                                }], // superscript/subscript
                                [{
                                    'indent': '-1'
                                }, {
                                    'indent': '+1'
                                }], // outdent/indent
                                [{
                                    'direction': 'rtl'
                                }], // text direction

                                [{
                                    'size': ['small', false, 'large', 'huge']
                                }], // custom dropdown
                                [{
                                    'header': [1, 2, 3, 4, 5, 6, false]
                                }],

                                [{
                                    'color': []
                                }, {
                                    'background': []
                                }], // dropdown with defaults from theme
                                [{
                                    'font': []
                                }],
                                [{
                                    'align': []
                                }],

                                ['clean'],
                                ['image']
                            ],
                            handlers: {
                                'image': function() {
                                    document.getElementById('getFile').click()
                                }
                            }
                        }
                    }
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                startTime: '',
                msg: 'Use Vue 2.0 Today!',
                options: [{
                    value: '1',
                    label: '医生'
                }, {
                    value: '2',
                    label: '护士'
                }],
                value: '选项1',
                input2: '',
                jgData: [],
                bmData: [],
                ryData: [],
                data: [],
                formInline: {
                    user: 'zxs',
                    region: ''
                },
                filterText: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.ryTree.filter(val);
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return JSON.stringify(data).indexOf(value) !== -1;
            },
            oneEditorChange(e) {
                
            },
            uploadFunction(e) {
                debugger
                let quill = this.$refs.myTextEditor.quill;
                let index = quill.getSelection().index;
                //you can get images data in e.target.files
                //an single example for using formData to post to server
                var form = new FormData()
                form.append('file', e.target.files[0])
                let rootUrl = this.axios.defaults.baseURL;
                this.axios.post(this.axios.defaults.baseURL + "/rest/uploadOriginalFile/04", form, {
                    headers: {
                        'Content-Type': form.type
                    }
                }).then((response) => {
                    // quill.insertEmbed(index, 'image', rootUrl+ `/rest/downLoadFile?fileName=` + response.data.msg.file);
                    let src = rootUrl+ `/rest/downLoadFile?fileName=` + response.data.msg.file;
                    quill.clipboard.dangerouslyPasteHTML(index, `<p><img src="`+src+`" width="100%"></img></p>`);
                    quill.setSelection(index+1, 0);
                }).catch(() => {
                })
            },
            startHacking() {
                this.$notify({
                    title: 'It Works',
                    message: 'We have laid the groundwork for you. Now it\'s your time to build something epic!',
                    duration: 6000
                })
            },
            handleIconClick(ev) {
                console.log(ev);
            },
            buNodeClick(nodeData) {
                this.type = 2;
                console.log(nodeData);
                this.targetNode = nodeData;
                // 加载人员
                loadRY(nodeData, this);
                // 加载文本
                loadInfo(this.type, nodeData, this);
            },
            jghandleNodeClick(nodeData) {
                this.type = 1;
                console.log(nodeData);
                this.targetNode = nodeData;
                // 加载人员
                loadRY(nodeData, this);
                // 加载部门
                loadBM(nodeData, this);
                // 加载文本
                loadInfo(1, nodeData, this);

            },
            ryhandleNodeClick(nodeData) {
                this.type = 3;
                this.targetNode = nodeData;
                loadInfo(3, nodeData, this);
            },
            handleNodeClick(nodeData) {
                this.type = 1;
                console.log(nodeData);
                this.targetNode = nodeData;
                // 加载部门
                loadBM(nodeData, this);
                // 加载文本
                loadInfo(1, nodeData, this);

            },
            nodeExpand(nodeData) {
                if (nodeData.loaded) {
                    return;
                } else {
                    loadNode(nodeData, this);
                }
            },
            bmNodeExpand(nodeData) {
                if (nodeData.loaded) {
                    return;
                } else {
                    loadBMNode(nodeData, this);
                }
            },
            onSubmit() {
                console.log('submit!');
            },
            save() {
                debugger
                var time = new Date(this.startTime).Format("yyyy-MM-dd hh:mm:ss");
                var param = {
                    xgid: this.targetNode.id + '',
                    lx: this.type + '',
                    qyrq: time,
                    nr: encodeURIComponent(encodeURI(this.content)),
                    zt: "1"
                }
                if (this.id) {
                    param.id = this.id
                }
                this.api.saveActicle(param)
                    .then(
                        (res) => {
                            if (res.code == 1) {
                                this.$message({
                                    message: '保存成功！',
                                    duration: 1000
                                });
                            }
                        },
                        (res) => {
                            console.log(res);
                        }
                    );
            },
            childLoad(node, resolve) {
                console.log(node, resolve);
            }
        },
        components: {
            quillEditor
        },
        mounted() {
            console.log(window.config);
            if(window.config){
                console.log(window.config);
                this.targetMode = window.config;
            }
            let params = {
                gljgid: '',
            }
            this.api.getJGList(params).then(
                res => {
                    console.log(res);
                    let data = res.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].state == 'open') {
                            data[i].children = [];
                        } else {
                            data[i].children = [{
                                text: '[空]'
                            }]
                        }
                    }
                    this.$set(this.$data, 'jgData', data);
                }
            );
            let quill = this.$refs.myTextEditor.quill;
            quill.keyboard.addBinding({ key: ' ' }, (range, context)=>{
                quill.clipboard.dangerouslyPasteHTML(range.index, '<b>&nbsp;</b>');
                quill.setSelection(range.index+1, 0);

            });

        },
        computed: {
            loading: function() {
                return !this.id;
            }
        },
}

function loadNode(nodeData, _this) {
    let params = {
        gljgid: nodeData.id,
    }
    _this.api.getJGList(params).then(
        res => {
            console.log(res);
            let data = res.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == 'open') {
                    data[i].children = [];
                } else {
                    data[i].children = [{
                        text: '[空]'
                    }]
                }
            }
            nodeData.children = data;
            nodeData.loaded = true;
        }
    );
}

function loadBM(nodeData, _this) {
    var params = {
        gljgid: nodeData.id,
    };
    _this.api.getBMList(params).then(
        res => {
            console.log(res);
            let data = res.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == 'open') {
                    data[i].children = [];
                } else {
                    data[i].children = [{
                        text: '[空]'
                    }]
                }
            }
            _this.$set(_this.$data, 'bmData', data)
        }
    );
}

function loadRY(nodeData, _this) {
    if (_this.type == 1) {
        var params = {
            ssjgid: nodeData.id + '',
            bmid: ''
        }
    }
    if (_this.type == 2) {
        var params = {
            ssjgid: nodeData.jgid + '',
            bmid: nodeData.id + ''
        }
    }

    _this.api.getRyList(params).then(
        res => {
            console.log(res);
            _this.ryData = res.data;
        }
    );
}

function loadBMNode(nodeData, _this) {
    var params = {
        sjid: nodeData.id,
    };
    _this.api.getBMNodeList(params).then(
        res => {
            console.log(res);
            let data = res.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == 'open') {
                    data[i].children = [];
                } else {
                    data[i].children = [{
                        text: '[空]'
                    }]
                }
            }
            nodeData.children = data;
            nodeData.loaded = true;
        }
    );
}

function loadInfo(type, nodeData, _this) {
    if(type!=_this.targetMode){
        return;
    }
    var params = {
        xgid: nodeData.id,
        lx: type + '',
    }
    _this.api.getActicle(params).then(
        res => {
            console.log(res);
            let data = res.data;
            if (data.length) {
                data = data[0];
            } else {
                data = {
                    nr: '',
                    id: '',
                    startTime: ''
                }
            }
            _this.$set(_this.$data, 'content', decodeURIComponent(data.nr));
            _this.$set(_this.$data, 'startTime', data.qyrq);
            _this.$set(_this.$data, 'id', data.id);
        }
    );
}
Date.prototype.Format = function(fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

</script>
<style socped>
.mobileBox {
    width: 360px;
    height: 640px;
    border:1px solid #CCCCCC;
    /*transform:scale(.8,.8);*/
}

.hide {
    display: none;
}

.demonstration {
    font-size: 20px;
}

.marginL20 {
    margin-left: 20px;
}

.buttonArea {
    margin-left: 50px;
}

.ql-container .ql-editor {
    min-height: 400px;
    padding-bottom: 1px;
    max-height: 600px;
}

.h300 {
    height: 200px;
    overflow: auto;
}

.hLeft {
    height: calc(100% - 300px);
}

.boxOut {
    padding: 10px;
    border: 1px solid #B3B3B3;
}

.articleHandleBox {
    line-height: 70px;
    height: 70px;
    background: #e8e6e6;
}

.fHead {
    height: 40px;
    background: #99A9BF;
    padding-top: 3px;
}

.flex {
    display: flex;
}

.half {
    flex: 1;
    padding-left: 3px;
    padding-right: 3px;
}

.searchPart {
    position: absolute;
    right: 10px;
    top: 0px;
}

.searchInput {
    margin-left: 20px;
    width: 40px;
}

body {
    font-family: Helvetica, sans-serif;
}

.border {
    border: 1px solid #d1dbe5;
}

.head {
    position: relative;
    background-color: #324057;
    height: 40px;
    width: 100%;
    color: white;
    text-align: center;
    line-height: 40px;
}

.withSearch {
    height: 75px;
}

.withSearch span {
    line-height: 40px;
}

body,
html {
    height: 100%;
}

.heightH {
    height: 100%;
}
</style>
