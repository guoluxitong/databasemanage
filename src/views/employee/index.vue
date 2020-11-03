<template>
  <div class="app-container employee-container">
    <el-row class="app-query">
      <!--<el-input v-model="listQuery.realName" placeholder="姓名"  style="width: 150px;"></el-input>-->
      <el-col :span="3">
      <el-input v-model="listQuery.mobile" placeholder="电话"  style="width: 140px;"></el-input>
      </el-col>
      <el-col :span="2">
      <el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
      <el-col :span="2">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
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
      <el-table-column align="left" :show-overflow-tooltip="true" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="微信">
        <template slot-scope="scope">
          <span>{{scope.row.weiXin}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="QQ">
        <template slot-scope="scope">
          <span>{{scope.row.qQ}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="true"  label="是否可用">
        <template slot-scope="scope">
          {{scope.row.status | statusFilterLabel(isAvailableArray)[0].label}}
        </template>
      </el-table-column>
    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <!--<menu-context-item @click="handleEditRole">角色管理</menu-context-item>-->
    </menu-context>
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
    <div class="el-dialog-employee">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form :rules="rules" ref="employeeFormData" :model="employeeFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row v-if="dialogStatus=='create'">
            <el-col :span="12">
              <el-form-item label="组织类型">
                <el-select class="filter-item" v-model="employeeFormData.orgType"  style="width: 100%" @change="orgTypeChange">
                  <el-option v-for="item in organizationType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织">
                <el-select clearable class="filter-item" v-model="employeeFormData.orgId"  style="width: 100%">
                  <el-option v-for="item in organiztionOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dialogStatus=='create'">
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="employeeFormData.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="QQ" prop="qQ">
                <el-input v-model="employeeFormData.qQ"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dialogStatus=='create'">
            <el-col :span="12">
              <el-form-item label="邮箱"  prop="email">
                <el-input v-model="employeeFormData.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微信" prop="weiXin">
                <el-input v-model="employeeFormData.weiXin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="employeeFormData.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input  v-model="employeeFormData.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dialogStatus=='create'">
            <el-col :span="12">
              <el-form-item label="是否可用" prop="status">
                <el-select class="filter-item" v-model="employeeFormData.status"  style="width: 100%">
                  <el-option v-for="item in isAvailableArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dialogStatus=='create'">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="employeeFormData.mark"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editData">确认</el-button>
          <el-button icon="el-icon-back" type="warning"  @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="角色管理" :visible.sync="dialogRoleFormVisible" width="30%">
      <el-form  ref="roleForm" :model="roleFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
        <el-select v-model="roleFormData.roleIdArray" multiple style="width: 100%" placeholder="请选择">
          <el-option v-for="item in roleFormData.roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editEmployeeRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {validateRealName,validatePassWord,validatePhone,validateQQ,validateEmail} from '@/utils/validate'
  import {getEmployeeListByConditionAndPage,editEmployeePass,createEmployee,getEmployeeInfoByMobile,editEmployeeRole,deleteEmployeeById} from '@/api/employee'
  import {getRoleListByCondition,getRoleListByEmployeeId} from '@/api/role'
  import {getEnterpriseListByConditionAndPage} from '@/api/enterprise'
  import {getCustomerListByConditionAndPage} from '@/api/customer'
  export default {
    data() {
      const validateCustomerFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('客户不能为空'))
        } else {
          callback()
        }
      }
      const validateRealNameFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('真实姓名不能为空'))
        }else if(!validateRealName(value)){
          callback(new Error('真实姓名必须为汉字'))
        } else {
          callback()
        }
      }
      const validatePassWordFun = (rule, value, callback) => {
        if (!validatePassWord(value)) {
          callback(new Error('密码至少为6位'))
        } else {
          callback()
        }
      }
      const validatePhoneFun = (rule, value, callback) => {

        this.listQuery.mobile=value
        getEmployeeListByConditionAndPage(this.listQuery).then(response => {
          if(response.data.data.length>0&this.dialogStatus =="create"){
            var exist=1
          }
          if(value.length<=0){
            callback(new Error('手机号码不能为空'))
          }else if (!validatePhone(value)) {
            callback(new Error('手机号码格式有误'))
          } else {
            callback()
          }
        })
      }
      // const validateWeiXinFun = (rule, value, callback) => {
      //   if (value&&!validateWeiXin(value)) {
      //     callback(new Error('微信格式有误'))
      //   } else {
      //     callback()
      //   }
      // }
      const validateQQFun = (rule, value, callback) => {
        if (value&&!validateQQ(value)) {
          callback(new Error('QQ格式有误'))
        } else {
          callback()
        }
      }
      const validateEmailFun = (rule, value, callback) => {
        if (value&&!validateEmail(value)) {
          callback(new Error('邮箱格式有误'))
        } else {
          callback()
        }
      }
      return {
        list: [],
        listQuery: {
          total:50,
          pageNum:1,
          pageSize:5,
          realName:null,
          mobile:null,
        },
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        employeeList:{},
        organizationType: [
          {label:"系统管理员",value:0},
          {label:"公司用户",value:1},
          {label:"企业用户",value:2},
          {label:"客户用户",value:3}
        ],
        enterpriseOption:[],
        customerOption:[],
        organiztionOption:[],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        isAvailableArray:[
          {value:1,label:'是'},
          {value:0,label:'否'}
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
        rules: {
          orgId: [{required: true, validator: validateCustomerFun }],
          realName: [{ trigger: 'blur',required: true, validator: validateRealNameFun }],
          mobile: [{ required: true,trigger: 'blur',required: true, validator: validatePhoneFun }],
          email: [{ trigger: 'blur', validator: validateEmailFun }],
          // weiXin: [{ trigger: 'blur', validator: validateWeiXinFun }],
          qQ: [{ trigger: 'blur', validator: validateQQFun }],
          password:[{ trigger: 'blur',required: true, validator: validatePassWordFun }]
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
    /*  this.getList();*/
     this.initEnterpriseList();
     this.initCustomerList();
    },
    methods: {
      initEnterpriseList(){
        let enterpriseOption=[]
        getEnterpriseListByConditionAndPage().then(data=>{
          data.data.data.forEach(item=>{
            enterpriseOption.push({value:item.id,label:item.enterpriseName})
          })
          this.enterpriseOption=enterpriseOption
        })
      },
      initCustomerList(){
        let customerOption=[]
        getCustomerListByConditionAndPage().then(data=>{
          data.data.data.forEach(item=>{
            customerOption.push({value:item.id+"",label:item.customerName})
          })
          this.customerOption=customerOption
        })
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row,event);
      },
      handleFilter() {
        this.getListByMobile()
      },
      getList() {
        this.listLoading = true
        getEmployeeListByConditionAndPage().then(response => {
          const data=response.data.data
          this.list=data
          this.listLoading = false
        })
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
      handleCreate() {
        this.resetTemp()
        this.employeeFormData.orgType=2
        this.organiztionOption=this.enterpriseOption
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['employeeFormData'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.orgTypeChange(Number(row.orgType))
        this.employeeFormData = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['employeeFormData'].clearValidate()
        })
      },
      orgTypeChange(value){
        this.employeeFormData.orgId=''
        if(value===0){
          this.organiztionOption=[{label:'系统管理员',value:0}]
        }else if(value===1){
          this.organiztionOption=[{label:'公司管理员',value:0},{label:'简洁软件有限公司',value:1}]
        }else if(value===2){
          this.organiztionOption=this.enterpriseOption
        }else if(value===3){
          this.organiztionOption=this.customerOption
        }else{
          this.organiztionOption=[]
        }
      },
      editData(){
        this.$refs.employeeFormData.validate(valid => {
          if (valid) {
            if(this.dialogStatus =='create'){
              createEmployee(this.employeeFormData).then(data=>{
                if(data.data.code==0){
                  this.dialogFormVisible = false
                  this.$message({
                    message: data.data.msg,
                    type: 'success'
                  });
                  this.listQuery.mobile=this.employeeFormData.mobile
                  this.getListByMobile()
                }else{
                  this.$message.error(data.data.msg)
                  return
                }
              })
            }else{
              editEmployeePass({
                loginId:this.employeeFormData.mobile,
                password:this.employeeFormData.password
              }).then(data=>{
                if(data.data.code==0){
                  this.dialogFormVisible = false
                  this.$message({
                    message: data.data.msg,
                    type: 'success'
                  });
                  this.listQuery.mobile=this.employeeFormData.mobile
                  this.getListByMobile()
                }else{
                  this.$message.error(data.data.msg)
                  return;
                }
              })
            }
          } else {
            return false
          }
        })
      },

      handleEditRole(row){
        this.roleFormData.employeeId=row.id
        getRoleListByCondition().then(response => {
          let roleOptions=[]
          let roleList=response.data.data;
          roleList.forEach(role=>{
            roleOptions.push({value:role.roleId,label:role.roleName})
          })
          this.roleFormData.roleOptions=roleOptions
          return getRoleListByEmployeeId(row.id)
        }).then(response=>{
          let roleIdArray=[]
          let roleList=response.data.data;
          roleList.forEach(role=>{
            roleIdArray.push(role.roleId)
          })
          this.roleFormData.roleIdArray=roleIdArray
          this.dialogRoleFormVisible = true
          this.$nextTick(() => {
            this.$refs['roleForm'].clearValidate()
          })
        })

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
