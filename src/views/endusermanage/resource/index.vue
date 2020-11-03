<template>
  <div class="app-container">
    <div v-if="submenu==0">
      <el-row class="resource-query">
        <el-col :span="2">
          <el-button @click="handleCreateFirstMenu" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="data.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"  v-loading="listLoading" element-loading-text="给我一点时间" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border  @row-contextmenu="openTableMenu">
        <el-table-column label="菜单名称">
          <template slot-scope="scope">
            <span>{{scope.row.resName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="路由地址">
          <template slot-scope="scope">
            <span>{{(scope.row.url==''||scope.row.url==null)?'无':scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面地址">
          <template slot-scope="scope">
          <span >
            {{(scope.row.pageUrl==''||scope.row.pageUrl==null)?'无':scope.row.pageUrl}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="是否隐藏">
          <template slot-scope="scope">
            <span v-for="item in hideStatusArray" v-if="item.value==scope.row.hidden">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handSelect">查看子菜单</menu-context-item>
        <menu-context-item @click="handleUpdate">编辑</menu-context-item>
       <!-- <menu-context-item @click="handleDelete">删除</menu-context-item>-->
      </menu-context>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form  :rules="rules" ref="resourceForm" :model="resourceFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
        <el-form-item label="菜单名称" prop="resName">
          <el-input v-model="resourceFormData.resName"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" >
          <el-input v-model="resourceFormData.url"></el-input>
        </el-form-item>
        <el-form-item label="页面地址" >
          <el-input v-model="resourceFormData.pageUrl"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-select clearable class="filter-item" v-model="resourceFormData.hidden"  style="width: 100%">
            <el-option v-for="item in hideStatusArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" >
          <el-input v-model="resourceFormData.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editData">确认</el-button>
        <el-button icon="el-icon-back" type="warning" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <div v-if="submenu==1">
      <el-row class="resource-query">
        <el-col :span="22">
          <el-button @click="handleCreateChildMenu" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-button  @click="handleCancel" icon="el-icon-back" type="warning" >取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="subList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border @row-contextmenu="openTableMenu">
        <el-table-column label="菜单名称">
          <template slot-scope="scope">
            <span>{{scope.row.resName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="路由地址">
          <template slot-scope="scope">
            <span>{{(scope.row.url==null&&scope.row.url=='')?'无':scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面地址">
          <template slot-scope="scope">
            <span>
            {{(scope.row.pageUrl==''||scope.row.pageUrl==null)?'无':scope.row.pageUrl}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="是否隐藏">
          <template slot-scope="scope">
            <span v-for="item in hideStatusArray" v-if="item.value==scope.row.hidden">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleUpdate">编辑</menu-context-item>
       <!-- <menu-context-item @click="handleDelete">删除</menu-context-item>-->
      </menu-context>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="subList.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import treeToArray from './customEval'
  import { getResourceList,editResource,createResource} from '@/api/resource'
  import {formatDateTime} from '@/utils/date'
  export default {
    name: 'customTreeTableDemo',

    data() {
      return {
        func: treeToArray,
        expandAll: false,
        data:[],
        subList:[],
        subdata:[],
        list: [],
        listLoading: false,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        submenu: 0,
        isShowAddChildMenu:'inline',
        hideStatusArray:[
          {value:0,label:'否'},
          {value:1,label:'是'}
        ],
        args: [null, null, 'timeLine'],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        total:'',
        resource:'',
        dialogStatus: '',
        dialogFormVisible: false,
        pId: '',
        resourceFormData: {
          id:'',
          permission: '',
          pId:'',
          resName:'',
          url:'',
          pageUrl:'',
          hidden:0,
          sort:'',
          createTime:formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),
        },

        rules: {
          resName: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      openTableMenu(row, event) {

        this.$refs.menuContext.openTableMenu(row,event);
      },
      inintSelect(){
        this.subList=[];
        for(var j=0 ; j<  this.total; j++){
          if(this.subdata[j].pId==this.pId){
            this.subList.push(this.subdata[j])
          }
        }
      },
      handSelect(row){
        this.pId=row.id
        this.subList=[];
        for(var i=0 ; i<  this.total; i++){
          if(this.subdata[i].pId==row.id){
            this.subList.push(this.subdata[i])
          }
        }
        this.submenu=1;
        this.currentPage1=1
      },
      handleCancel(){
        this.submenu=0;
        this.currentPage1=1
      },
      getList() {
        this.listLoading=true
        this.data=[];
        this.subdata=[];
        this.list=[];
        getResourceList().then(response => {
          this.list=response.data.data
          for(var i=0 ; i < this.list.length;  i++){
            if(this.list[i].pId==0){
              this.data.push(this.list[i])
            }else{
              this.subdata.push(this.list[i])
            }
          }
          this.total=this.subdata.length;
          this.inintSelect();
            this.listLoading=false
        })
      },
      resetTemp() {
        this.resourceFormData = {
          id:'',
          resName:'',
          url:'',
          pageUrl:'',
          hidden:0,
          sort:'',
        }
      },
      handleCreateFirstMenu(){
        this.resetTemp()
        this.resourceFormData.pId=0;
        this.resource=0
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      handleCreateChildMenu(row){
        this.resetTemp()
        this.resourceFormData.pId=this.pId
        this.resource=1
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.resourceFormData = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      editData(){
        this.$refs.resourceForm.validate(valid => {
          if (valid) {
            if(  this.dialogStatus == 'create') {
              createResource(this.resourceFormData).then(data => {
                if(data.data.code==0){
                  this.dialogFormVisible = false
                  this.$message({
                    message: '成功',
                    type: 'success'
                  });
                  this.getList()
                }else{
                  this.$message.error(data.data.msg)
                  return
                }
              })
            }else{
              editResource(this.resourceFormData).then(data=>{
                if(data.data.code==0){
                  this.dialogFormVisible = false
                  this.$message({
                    message: '成功',
                    type: 'success'
                  });
                  this.getList()
                }else {
                  this.$message.error(data.data.msg)
                  return
                }
              })
            }
          } else {
            return false
          }
      })
      },
     /* handleDelete(row) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResourceById(row.id).then(data=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },*/
      handleSizeChange1: function(pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function(currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .resource-query{
    .el-input,.el-select,.el-button{
      margin-bottom: 10px;
    }
  }
</style>
