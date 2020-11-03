<template>
  <div class="app-container">
    <el-row class="app-query">
      <el-col :span="2">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column align="left" :show-overflow-tooltip="true" label="购买项目">
      <template slot-scope="scope">
        <span>{{scope.row.resourceName}}</span>
      </template>
    </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="时长">
        <template slot-scope="scope">
          <span>{{scope.row.rangeType==1?scope.row.range+'天':scope.row.range+'月'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <menu-context-item @click="handleDelete">删除</menu-context-item>
    </menu-context>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[5]"  layout="total, sizes, prev, pager, next, jumper" :total="list.length">
      </el-pagination>
    </div>
    <div class="el-dialog-device">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form  :model="ResourceProductList" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row>
            <el-col :span="12">
                <el-form-item label="购买项目">
                  <el-autocomplete
                    v-model="ResourceProductList.resourceName"
                    :fetch-suggestions="querySearchAsyncuser"
                    placeholder="购买项目"
                    @select="((item)=>{handleSelectuser(item)})"
                  ></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间类型">
                <el-select clearable class="filter-item" v-model="ResourceProductList.rangeType"  style="width: 100%">
                  <el-option v-for="item in timeTypeArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="价格">
                <el-input v-model="ResourceProductList.price" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时长">
                <el-input v-model="ResourceProductList.range" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editData">确认</el-button>
          <el-button icon="el-icon-back" type="warning" @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import {fuelArray,mediumArray} from '@/utils/common'
  import {formatDateTime} from '@/utils/date'
  import {getWeChatList,editWeChat,deleteWeChat,addWeChat,getResourceList} from '@/api/wechat'
  import {getCustomerListByEnterpriseId} from '@/api/token-dict'
  import {getDeviceTypeList} from '@/api/device-type'
  export default {
    data() {
      return {
        list: [],
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        ResourceProductList:{
          id:null,
          resourceId:'',
          rangeType:'',
          price:'',
          range:'',
          resourceName:''
        },
        ResourceArray:[],
        ResourceList:[],
        timeTypeArray:[
          {
            value:1,
            label:'天'
          },
          {
            value:2,
            label:'月'
          }
        ],
        timeTypeList:[],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        dialogQRCodeFormVisible:false,
        listLoading:false
      }
    },
    filters: {
    },
    created() {
      this.getList()

    },
    methods: {
      saveitem(item){
        console.log(item)
        this.ResourceProductList.resourceName=item.resName
      },
      querySearchAsyncuser(queryString, callback) {
        var results = [];
        for (let i = 0, len = this.ResourceArray.length; i < len; i++) {
          this.ResourceArray[i].value = this.ResourceArray[i].resName;
        }
        this.ResourceList = this.ResourceArray;
        results = queryString ? this.ResourceList.filter(this.createFilteruser(queryString)) : this.ResourceList;
        callback(results);
      },

      createFilteruser(queryString, queryArr) {
        return (queryArr) => {
          return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectuser(item) {
        this.ResourceProductList.resourceId=item.id
        this.ResourceProductList.resourceName=item.resName
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row,event);
      },
      getList() {
        this.listLoading = true
        getWeChatList().then(response => {
          const data=response.data.data
          this.list=data
          this.listLoading = false
        })
        getResourceList().then(response => {
          const data=response.data.data
          this.ResourceArray=data
          this.listLoading = false
        })
      },

      resetTemp() {
        this.ResourceProductList = {
          resourceId:'',
          rangeType:'',
          price:'',
          range:'',
          resourceName:''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true

      },
      handleUpdate(row) {
        this.ResourceProductList =row
        this.dialogStatus = 'update'
        this.dialogFormVisible = true

      },

      editData(){
          if(this.dialogStatus =='create'){
            addWeChat({
                resourceId:this.ResourceProductList.resourceId,
                rangeType:this.ResourceProductList.rangeType,
                price:parseInt(this.ResourceProductList.price),
                range:parseInt(this.ResourceProductList.range),
                resourceName:this.ResourceProductList.resourceName
              }
            ).then(data=>{
              this.dialogFormVisible = false
              this.$message({
                message: "成功",
                type: 'success'
              });
              this.getList()
            })
          }else{
            editWeChat({
               id:this.ResourceProductList.id,
                resourceId:this.ResourceProductList.resourceId,
                rangeType:this.ResourceProductList.rangeType,
                price:parseInt(this.ResourceProductList.price),
                range:parseInt(this.ResourceProductList.range),
                resourceName:this.ResourceProductList.resourceName
              }
            ).then(data=>{
              this.dialogFormVisible = false
              this.$message({
                message: "成功",
                type: 'success'
              });
              this.getList()
            })
          }

      },
      handleDelete(row) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWeChat(row.id).then(data=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            });
           var page= this.list.length
            page%5==1?this.currentPage1=this.currentPage1-1:this.currentPage1;
           console.log(this.currentPage1)
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        this.pageSize1 = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.currentPage1 = val
        this.getList()
      }
    }
  }
</script>
