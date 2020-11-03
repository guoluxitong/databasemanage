<template>
  <div class="app-container">
    <el-row class="app-query">
      <el-col :span="3">
      <el-input clearable v-model="listQuery.deviceNo" placeholder="设备编号"  style="width: 130px;"></el-input>
      </el-col>
      <el-col :span="3">
      <el-input clearable v-model="listQuery.employeeMobile" placeholder="用户名称"  style="width: 130px;"></el-input>
      </el-col>
      <el-col :span="2">
      <el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
      <el-col :span="2">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column align="left" :show-overflow-tooltip="true" label="设备编号">
      <template slot-scope="scope">
        <span>{{scope.row.deviceNo}}</span>
      </template>
    </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="用户名称">
        <template slot-scope="scope">
          <span>{{scope.row.employeeMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDatetime}}</span>
        </template>
      </el-table-column>

    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <menu-context-item @click="handleDelete">删除</menu-context-item>
    </menu-context>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>
    <div class="el-dialog-device">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form ref="deviceFormData" :model="deviceFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备编号">
                  <el-input v-model="deviceFormData.deviceNo" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名称">
                  <el-input v-model="deviceFormData.employeeMobile" ></el-input>
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
  import {getRelation_DeviceControlMapMapperListByConditionAndPage,editRelation_DeviceControlMap,deleteRelation_DeviceControlMapById} from '@/api/relation_devicecontrolmap'
  import {getCustomerListByEnterpriseId} from '@/api/token-dict'
  import {getDeviceTypeList} from '@/api/device-type'
  export default {
    data() {
      return {
        list: null,
        size: '',
        listQuery: {
          total:50,
          pageNum:1,
          pageSize:5,
          deviceNo:null,
          employeeMobile:null,
          createDatetime:null
        },
        customerOption:[],
        isOrNotArray:[
          {value:1,label:'是'},
          {value:0,label:'否'}
        ],
     /*   isOrbool:[
          {value:1,label:'✔'},
          {value:0,label:''}
        ],*/
        /*✖*/
        deviceTypeOption:[],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        fuelArray:fuelArray,
        mediumArray:mediumArray,
        dialogStatus: '',
        dialogFormVisible: false,
        deviceFormData: {
          id:'',
          deviceNo:'',
          employeeMobile:'',
          createDatetime:''
        },
        dialogQRCodeFormVisible:false,
        qRCodeFormData:{
          startSuffix:'',
          endSuffix:''
        },

        listLoading:false
      }
    },
    filters: {
      statusFilterLabel(status,dictaryList){
        return dictaryList.filter(item => {
          return item.value==status
        })
      }
    },
    created() {
      this.getList()

    },
    methods: {

      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row,event);
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getRelation_DeviceControlMapMapperListByConditionAndPage(this.listQuery).then(response => {
          const data=response.data.data
          this.list=data.list
          this.listQuery.total=data.total
          this.listQuery.pageNum=data.pageNum
          this.listQuery.pageSize=data.pageSize
          this.size=data.size
          this.listLoading = false
        })
      },

      resetTemp() {
        this.deviceFormData = {
          id:'',
          deviceNo:'',
          employeeMobile:'',
          createDatetime:''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['deviceFormData'].clearValidate()
        })
      },
      handleGenerateQRCode(){
        this.qRCodeFormData.startSuffix=''
        this.qRCodeFormData.endSuffix=''
        this.dialogQRCodeFormVisible = true
        this.$nextTick(() => {
          this.$refs['qRCodeForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.deviceFormData = Object.assign({}, row) // copy obj
        if(this.deviceFormData.saleDatetime){
          this.deviceFormData.saleDatetime=new Date(this.deviceFormData.saleDatetime)
        }else{
          this.deviceFormData.saleDatetime=new Date()
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['deviceFormData'].clearValidate()
        })
      },

      editData(){
        this.$refs.deviceFormData.validate(valid => {
          if (valid) {
            editRelation_DeviceControlMap(this.deviceFormData).then(data=>{
              this.dialogFormVisible = false
              this.$message({
                message: "成功",
                type: 'success'
              });
              this.getList()
            })
          } else {
            return false
          }
        })
      },
      handleDelete(row) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRelation_DeviceControlMapById(row.id).then(data=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.list.splice(this.list.indexOf(row), 1)
            if (this.size == 1) {
              this.listQuery.pageNum = this.listQuery.pageNum > 1 ? this.listQuery.pageNum - 1 : 1;
            }
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
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      }
    }
  }
</script>
