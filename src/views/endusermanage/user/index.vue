<template>
  <div class="app-container employee-container">
    <el-row>
      <el-col :span="12">
        <el-row class="app-query">
          <!--<el-input v-model="listQuery.realName" placeholder="姓名"  style="width: 150px;"></el-input>-->
          <el-col :span="7">
            <el-autocomplete
              style="width: 140px"
              v-model="endUser.endUserName"
              :fetch-suggestions="querySearchAsyncuser"
              placeholder="终端用户"
              @select="((item)=>{handleSelectuser(item)})"
            ></el-autocomplete>
          </el-col>
         <el-col :span="6">
            <el-button  type="primary" icon="el-icon-search" @click="handleendUser">查询</el-button>
          </el-col>
        </el-row>
          <el-table :data="endUserListArray.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" >
            <el-table-column :show-overflow-tooltip="true" align="left" label="终端用户名称">
              <template slot-scope="scope">
                <span>{{endUser.endUserName}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
              <template slot-scope="scope">
                <span v-for="item in statusArray" v-if="item.value==endUser.status">{{item.label}}</span>
              </template>
            </el-table-column>

          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[5]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="endUserListArray.length"
            ></el-pagination>
          </div>
      </el-col>
      <el-col :offset="1" :span="11">
    <el-row class="app-query">
      <!--<el-input v-model="listQuery.realName" placeholder="姓名"  style="width: 150px;"></el-input>-->
      <el-col :span="7">
      <el-input v-model="listQuery.mobile" placeholder="电话"  style="width: 140px;"></el-input>
      </el-col>
      <el-col :span="6">
      <el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" >
      <el-table-column align="left" :show-overflow-tooltip="true" label="真实姓名">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="true"  label="是否可用">
        <template slot-scope="scope">
          {{scope.row.status | statusFilterLabel(isAvailableArray)[0].label}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="currentPage1"
        :page-sizes="[5]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
      ></el-pagination>
    </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :offset="10" :span="3">
        <template>
        <el-checkbox  v-model="roleId" true-label=0 border size="medium">是否为管理员</el-checkbox >
        </template>
      </el-col>
    </el-row>
    <el-row >
      <el-col :offset="20" :span="3">
        <el-button  type="primary"  @click="submit">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {validateRealName,validatePassWord,validatePhone,validateQQ,validateEmail} from '@/utils/validate'
  import {getEmployeeListByConditionAndPage,editEmployeePass,createEmployee,getEmployeeInfoByMobile,editEmployeeRole,deleteEmployeeById} from '@/api/employee'
  import {change} from '@/api/user'
  import {enduserlist} from '@/api/enduser'
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    components: {ElRow},
    data() {
      return {
        list: [],
        endUserList: [],
        endUserArray: [],
        endUserListArray: [],
        listQuery: {
          total:50,
          pageNum:1,
          pageSize:5,
          realName:null,
          mobile:null,
        },
        endUser:{
          id: '',
          endUserName: '',
          status: '',
        },
        roleId: 1,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        employeeList:{},
        dialogStatus: '',
        dialogFormVisible: false,
        isAvailableArray:[
          {value:1,label:'是'},
          {value:0,label:'否'}
        ],
        statusArray:[
          {value:0,label:'否'},
          {value:1,label:'是'}
        ],
        employeeFormData: {
          mobile:'',
          orgType:'',
          orgId:'',
          email:'',
          weiXin:'',
          qQ:'',
          realName:'',
          password:'',
          status:1,
          mark:'',
          lastLoginDatetime:null
        },
        dialogRoleFormVisible: false,
        roleFormData:{
          employeeId:'',
          roleIdArray:[],
          roleOptions:[],
        },
        listLoading:false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger'
        }
        return statusMap[status]
      },
      statusFilterLabel(status,isAvailableArray){
        return isAvailableArray.filter(item => {
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
        this.getListByMobile()
      },
      handleendUser(){
        this.endUserListArray=[];
       for(var i=0; i< this.endUserList.length; i++){
         if(this.endUserList[i].id==this.endUser.id){
           this.endUserListArray.push(this.endUserList[i].id)
         }
       }
      },
      getList() {
        this.listLoading = true
        enduserlist().then(response => {
          if(response.data.code==0){
            const data=response.data.data

            this.endUserArray=data

            this.listLoading = false
          }else{
            this.$message.error(response.data.msg)
            return
          }
        })
      },
      querySearchAsyncuser(queryString, callback) {
        var results = [];
        for (let i = 0, len = this.endUserArray.length; i < len; i++) {
          this.endUserArray[i].value = this.endUserArray[i].endUserName;
        }
        this.endUserList = this.endUserArray;
        results = queryString ? this.endUserList.filter(this.createFilteruser(queryString)) : this.endUserList;
        callback(results);
      },

      createFilteruser(queryString, queryArr) {
        return (queryArr) => {
          return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectuser(item) {
        this.endUser.id=item.id
        this.endUser.status=item.status
      },
      getListByMobile() {
        this.listLoading = true
        this.list=[];
        getEmployeeInfoByMobile(
         this.listQuery.mobile
        ).then(response => {
          const data=response.data.data
          this.employeeList=data;
          this.list.push(this.employeeList)
          this.listLoading = false
        })
      },
      submit(){
        change({
          id:this.list[0].id,
          orgId:this.endUser.id,
          orgType:2,
          realName:this.list[0].realName,
          roleId:this.roleId
        }).then(response => {
          if(response.data.code==0){
            this.$message({
              message: '成功',
              type: 'success'
            });
          }else {
            this.$message.error(response.data.msg)
            return
          }
        })
      },
      resetTemp() {
        this.employeeFormData = {
          mobile:'',
          orgType:'',
          orgId:'',
          email:'',
          weiXin:'',
          qQ:'',
          realName:'',
          password:'',
          status:1,
          mark:''
        }
      },
      handleEditRole(row){
        this.roleFormData.employeeId=row.id
      },
      editEmployeeRole(){
        let employeeRoleList=[]
        this.roleFormData.roleIdArray.forEach(roleId=>{
          employeeRoleList.push({roleId:roleId,employeeId:this.roleFormData.employeeId})
        })
        editEmployeeRole({id:this.roleFormData.employeeId,employeeRoleList:employeeRoleList}).then(response=>{
          this.dialogRoleFormVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getList()
        })
      },
      handleSizeChange1: function(pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function(currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      }
    }
  }
</script>
