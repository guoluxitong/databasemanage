<template>
  <div>
  <div v-if="enterprisecodevisible===0" class="app-container">
    <el-row class="app-query">
      <!--<el-input v-model="listQuery.enterpriseName" placeholder="企业名称"  style="width: 150px;"></el-input>-->
      <!--<el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>-->
      <el-col :span="2">
      <el-button  @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
      <el-col :span="2">
      <el-button  type="primary" @click="enterprise">企业编号管理</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column :show-overflow-tooltip="true" align="left" label="企业名称">
        <template slot-scope="scope">
          <span>{{scope.row.enterpriseName}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
        <template slot-scope="scope">
          <span v-for="item in statusArray" v-if="item.value==scope.row.status">{{item.label}}</span>
        </template>
      </el-table-column>
      <el-table-column  align='center' label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="customer(scope.$index, scope.row)">企业客户管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <!--<menu-context-item @click="handleDelete">删除</menu-context-item>-->
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
    <div class="el-dialog-enterprise">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
        <el-form :rules="rules" ref="enterpriseForm" :model="enterpriseFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="enterpriseFormData.enterpriseName"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-select clearable class="filter-item" v-model="enterpriseFormData.status"  style="width: 100%">
              <el-option v-for="item in statusArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editData">确认</el-button>
          <el-button icon="el-icon-back" type="warning" @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
    <div v-if="enterprisecodevisible===1">
      <el-row style="margin-left: 10px;margin-top: 10px" class="app-query">
        <el-col :span="22">
      <el-button  @click="handleCustomerCreate" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :span="2">
      <el-button icon="el-icon-back" type="warning" @click="handleCancel"  >取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="customerList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">

        <el-table-column :show-overflow-tooltip="true" align="left" label="企业名称">
          <template slot-scope="scope">
            <span>{{enterpriseName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
          <el-table-column  align='center' label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="customercode(scope.$index, scope.row)">企业客户编号管理</el-button>
            </template>
          </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleCustomerUpdate">编辑</menu-context-item>
        <!--<menu-context-item @click="handleDelete">删除</menu-context-item>-->
      </menu-context>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="customerList.length"
        ></el-pagination>
      </div>
      <div class="el-dialog-customer">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCustomerFormVisible" width="30%">
          <el-form :rules="rules" ref="enterprisecustomerForm" :model="enterprisecustomerFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="enterprisecustomerFormData.customerName"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editCustomerData">确认</el-button>
            <el-button icon="el-icon-back" type="warning" @click="dialogCustomerFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-if="enterprisecodevisible===2">
      <el-row style="margin-left: 10px;margin-top: 10px" class="app-query">
        <el-col :span="22">
      <el-button  @click="handleCodeCreate" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :span="2">
      <el-button  @click="handleCodeCancel" icon="el-icon-back" type="warning" >取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="customerCodeList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" >

        <el-table-column :show-overflow-tooltip="true" align="left" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
          <template slot-scope="scope">
            <span v-for="item in statusArray" v-if="item.value==scope.row.status">{{item.label}}</span>
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
          :total="customerCodeList.length"
        ></el-pagination>
      </div>
      <div class="el-dialog-customer">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCustomerCodeFormVisible" width="30%">
          <el-form :rules="rules" ref="customerForm" :model="enterprisecustomerCodeFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
            <el-form-item label="编号" prop="code">
              <el-input v-model="enterprisecustomerCodeFormData.code"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editCodeData">确认</el-button>
            <el-button icon="el-icon-back" type="warning" @click="dialogCustomerCodeFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div >
    <div  v-if="enterprisecodevisible===3">
      <el-row style="margin-left: 10px;margin-top: 10px" class="app-query">
        <el-col :span="22">
      <el-button @click="handleEnterpriseCreate" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :span="2">
      <el-button icon="el-icon-back" type="warning" @click="handleEnterpriseCancel"  >取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="enterpriseCodeList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
        <el-table-column :show-overflow-tooltip="true" align="left" label="企业名称">
          <template slot-scope="scope">
            <span>{{scope.row.enterpriseName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.codePrefix}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
          <template slot-scope="scope">
            <span v-for="item in statusArray" v-if="item.value==scope.row.status">{{item.label}}</span>
          </template>
        </el-table-column>

      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleEnterpriseUpdate">编辑</menu-context-item>
      </menu-context>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="enterpriseCodeList.length"
        ></el-pagination>
      </div>
      <div class="el-dialog-customer">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCodeFormVisible" width="30%">
          <el-form :rules="rules" ref="enterpriseForm" :model="enterpriseCodeFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
            <el-form-item v-if="dialogStatus =='create'" label="企业" prop="enterpriseName">
              <el-autocomplete
                v-model="enterpriseName"
                :fetch-suggestions="querySearchAsyncuser"
                placeholder="企业"
                @select="((item)=>{handleSelectuser(item)})"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item v-if="dialogStatus =='create'"  label="编号" prop="codePrefix">
              <el-input v-model="enterpriseCodeFormData.codePrefix"></el-input>
            </el-form-item>
            <el-form-item label="是否可用">
              <el-select clearable class="filter-item" v-model="enterpriseCodeFormData.status"  style="width: 100%">
                <el-option v-for="item in statusArray1" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editEnterpriseData">确认</el-button>
            <el-button icon="el-icon-back" type="warning" @click="cancel">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
    import {getEnterpriseListByConditionAndPage,editEnterprise,create,deleteEnterpriseById} from '@/api/enterprise'
    import {enterprisecodelist,editenterprisecode,createPrefix} from '@/api/enterpriseCode'
    import {enterprisecustomerlist,editenterprisecustomer,createcustomer} from '@/api/enterpriseCustomer'
    import {enterprisecustomercodelist,editenterprisecustomercode} from '@/api/enterpriseCustomerCode'
    export default {
        data() {
            return {
                list: [],
              customerList:[],
              customerCodeList:[],
              enterpriseCodeList:[],
              listQuery: {
                    total:50,
                    pageNum:1,
                    pageSize:5,
                    enterpriseName:null
                },
              currentPage1: 1,
              pageNum1: 1,
              pageSize1: 5,
              enterpriseName: '',
              listQuery1: {
                total:50,
                pageNum:1,
                pageSize:5,
                enterpriseId:"",
                customerName:""
              },
              listQuery2: {
                total:50,
                pageNum:1,
                pageSize:5,
                enterpriseCustomerId:"",
                code:"",
                codePrefix: ''
              },
              listQuery3: {
                total:50,
                pageNum:1,
                pageSize:5,
                enterpriseId:"",
                codePrefix: ''
              },
                statusArray:[
                    {value:0,label:'否'},
                    {value:1,label:'是'}
                ],
              statusArray1:[
                {value:0,label:'否'},
                {value:1,label:'是'}
              ],
                textMap: {
                    update: '编辑',
                    create: '新增'
                },
              enterpriseCustomerId: '',
                dialogStatus: '',
                dialogFormVisible: false,
              dialogCodeFormVisible: false,
                dialogCustomerFormVisible: false,
              dialogCustomerCodeFormVisible: false,
                enterpriseFormData: {
                    id:'',
                    enterpriseName:'',
                    status:1
                },
              enterpriseCodeFormData: {
                  id:'',
                enterpriseId:"",
                codePrefix: '',
                status:1
              },
              enterprisecustomerFormData: {
                enterpriseId:'',
                customerName:'',
                id:'',
                status:1
              },
              enterprisecustomerCodeFormData: {
                enterpriseCustomerId:"",
                code:"",
                codePrefix:'',
              },
              enterpriseOption:[],
              enterpriseList:[],
              enterprisecodevisible:0,
                rules: {
                  enterpriseId: [
                    { required: true, message: '企业id不能为空', trigger: 'blur' }
                  ],
                  customerName: [
                    { required: true, message: '客户名称不能为空', trigger: 'blur' }
                  ],

                  enterpriseCustomerId: [
                    { required: true, message: '企业客户Id不能为空', trigger: 'blur' }
                  ],
                  code: [
                    { required: true, message: '编号不能为空', trigger: 'blur' }
                  ],
                  codePrefix: [
                    { required: true, message: '编号不能为空', trigger: 'blur' }
                  ],
                },
                listLoading: true,
            }
        },
        created() {
            this.getList()
          this.inintselect()
        },
        methods: {
          cancel(){
            this.dialogCodeFormVisible = false
            this.enterpriseName=''
          },
          inintselect(){
            getEnterpriseListByConditionAndPage().then(response => {
              this.enterpriseOption = response.data.data;
            })
          },
          querySearchAsyncuser(queryString, callback) {
              var results = [];
              for (let i = 0, len = this.enterpriseOption.length; i < len; i++) {
                this.enterpriseOption[i].value = this.enterpriseOption[i].enterpriseName;
              }
              this.enterpriselist = this.enterpriseOption;
              results = queryString ? this.enterpriselist.filter(this.createFilteruser(queryString)) : this.enterpriselist;
              callback(results);
          },

          createFilteruser(queryString, queryArr) {
            return (queryArr) => {
              return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          handleSelectuser(item) {
            this.enterpriseCodeFormData.enterpriseId=item.id
            this.enterprisecustomerFormData.enterpriseId=item.id
          },
          customercode(index,row){
            this.currentPage1=1
            this.enterprisecodevisible=2;
            this.listQuery2.enterpriseCustomerId=row.id;
            this.enterpriseCustomerId=row.id;
            this.getCustomerCodeList()
          },
          customer(index,row){
            this.currentPage1=1
            this.enterprisecodevisible=1;
            this.listQuery1.enterpriseId=row.id;
            this.enterpriseName=row.enterpriseName;
            this.enterprisecustomerFormData.status=row.status;
            this.getCustomerList()
          },
          enterprise(){
            this.currentPage1=1
            this.enterprisecodevisible=3;
            this.getEnterpriseList()
          },
          getEnterpriseList() {
            this.listLoading = true;
            enterprisecodelist().then(response => {
            if(response.data.code==0){
              const data=response.data.data;
              this.enterpriseCodeList=data;
              this.listLoading = false
            }else {
              this.$message.error(response.data.msg)
              return
            }
            })
          },
          getCustomerList() {
            this.listLoading = true;
            enterprisecustomerlist(this.listQuery1.enterpriseId).then(response => {
              if(response.data.code==0){
                const data=response.data.data;
                this.customerList=data;
                this.listLoading = false
              }else{
                this.$message.error(response.data.msg)
                return
              }
            })
          },
          getCustomerCodeList() {
            this.listLoading = true;
            enterprisecustomercodelist(this.listQuery2.enterpriseCustomerId).then(response => {
             if(response.data.code==0){
               const data=response.data.data;

               this.customerCodeList=data;

               this.listLoading = false
             }else{
               this.$message.error(response.data.msg)
               return
             }
            })
          },
            openTableMenu(row, event) {
                this.$refs.menuContext.openTableMenu(row,event);
            },
            handleFilter() {
                this.listQuery.pageNum = 1;
                this.getList()
            },
            getList() {
                this.listLoading = true;
                getEnterpriseListByConditionAndPage().then(response => {
                  if(response.data.code==0){
                    const data=response.data.data;
                    this.list=data;
                    this.listLoading = false
                  }else{
                    this.$message.error(response.data.msg)
                    return
                  }
                })
            },
            resetTemp() {
                this.enterpriseFormData = {
                    id:'',
                    enterpriseName:'',
                    status:1
                }
            },
          handleCancel(){
            this.currentPage1=1
            this.enterprisecodevisible=0;
          },
          handleCodeCancel(){
            this.currentPage1=1
            this.enterprisecodevisible=1;
          },
          handleEnterpriseCancel(){
            this.currentPage1=1
            this.enterpriseName=''
            this.enterprisecodevisible=0;
          },
          handleCodeCreate(){
            this.enterprisecustomerCodeFormData={
              enterpriseCustomerId:"",
                code:"",
              codePrefix:'',
            };
            this.dialogStatus = 'create';
            this.dialogCustomerCodeFormVisible=true;
            this.$nextTick(() => {
              this.$refs['customerForm'].clearValidate()
            })
          },
          handleEnterpriseCreate(){
            this.enterpriseCodeFormData={
              enterpriseId:'',
                codePrefix: '',
                status:1
            };
            this.dialogStatus = 'create';
            this.dialogCodeFormVisible=true;
            this.$nextTick(() => {
              this.$refs['enterpriseForm'].clearValidate()
            })
          },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
              this.$nextTick(() => {
                this.$refs['enterpriseForm'].clearValidate()
              })
            },
          handleCustomerCreate() {
            this.enterprisecustomerFormData={
                  id:'',
                enterpriseId:'',
                customerName:''
            };
            this.dialogStatus = 'create';
            this.dialogCustomerFormVisible = true;
            this.$nextTick(() => {
              this.$refs['enterprisecustomerForm'].clearValidate()
            })
          },
          handleCustomerUpdate(row) {
            this.enterprisecustomerFormData = Object.assign({}, row) ;// copy obj
            this.dialogStatus = 'update';
            this.dialogCustomerFormVisible = true;
            this.$nextTick(() => {
              this.$refs['enterprisecustomerForm'].clearValidate()
            })
          },
          handleEnterpriseUpdate(row){
            this.enterpriseCodeFormData = Object.assign({}, row) ;// copy obj
            this.dialogStatus = 'update';
            this.dialogCodeFormVisible = true;
            this.$nextTick(() => {
              this.$refs['enterpriseForm'].clearValidate()
            })
          },
          editEnterpriseData(){
            this.$refs.enterpriseForm.validate(valid => {
              if (valid) {
                if(  this.dialogStatus =='create'){
                  createPrefix({
                    enterpriseId:this.enterpriseCodeFormData.enterpriseId,
                    prefix: this.enterpriseCodeFormData.codePrefix,
                  }).then(data=>{
                    if(data.data.code==0){
                      this.dialogCodeFormVisible = false;
                      this.$message({
                        message: '成功',
                        type: 'success'
                      });
                      this.getEnterpriseList()
                    }else {
                      this.$message.error(data.data.msg)
                      return
                    }
                  })
                }else{
                  editenterprisecode({
                    enterpriseId:this.enterpriseCodeFormData.id,
                    status: this.enterpriseCodeFormData.status,
                  }).then(data=>{
                    if(data.data.code==0){
                      this.dialogCodeFormVisible = false;
                      this.$message({
                        message: '成功',
                        type: 'success'
                      });
                      this.getEnterpriseList()
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
          editCodeData(){
            this.enterprisecustomerCodeFormData.enterpriseCustomerId=this.enterpriseCustomerId;
            this.$refs.customerForm.validate(valid => {
              if (valid) {
                editenterprisecustomercode({
                  enterpriseCustomerId:this.enterprisecustomerCodeFormData.enterpriseCustomerId,
                  code:this.enterprisecustomerCodeFormData.code,
                }).then(data=>{
                  if(data.data.code==0){
                    this.dialogCustomerCodeFormVisible = false;
                    this.$message({
                      message: '成功',
                      type: 'success'
                    });
                    this.getCustomerCodeList()
                  }else{
                    this.$message.error(data.data.msg)
                    return
                  }
                })
              } else {
                return false
              }
            })
          },
          editCustomerData(){
            this.$refs.enterprisecustomerForm.validate(valid => {
              if (valid) {
                if(this.dialogStatus =='create'){
                  createcustomer({
                    enterpriseId:this.listQuery1.enterpriseId,
                    customerName:this.enterprisecustomerFormData.customerName,
                    status:1
                  }).then(data=>{
                    if(data.data.code==0){
                      this.dialogCustomerFormVisible = false;
                      this.$message({
                        message: '成功',
                        type: 'success'
                      });
                      this.getCustomerList()
                    }else{
                      this.$message.error(data.data.msg)
                      return
                    }
                  })
                }else{
                  editenterprisecustomer({
                    id:this.enterprisecustomerFormData.id,
                    customerName:this.enterprisecustomerFormData.customerName,
                  }).then(data=>{
                    if(data.data.code==0){
                      this.dialogCustomerFormVisible = false;
                      this.$message({
                        message: '成功',
                        type: 'success'
                      });
                      this.getCustomerList()
                    }else{
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
            handleUpdate(row) {
                this.enterpriseFormData = Object.assign({}, row) ;// copy obj
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
              this.$nextTick(() => {
                this.$refs['enterpriseForm'].clearValidate()
              })
            },
            editData(){
              this.$refs.enterpriseForm.validate(valid => {
                if (valid) {
                  if( this.dialogStatus =='create'){
                    create({
                      enterpriseName:this.enterpriseFormData.enterpriseName,
                      status:this.enterpriseFormData.status
                    }).then(data=>{
                      if(data.data.code==0){
                        this.dialogFormVisible = false;
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
                    editEnterprise({
                      id:this.enterpriseFormData.id,
                      enterpriseName:this.enterpriseFormData.enterpriseName,
                      status:this.enterpriseFormData.status
                    }).then(data=>{
                      if(data.data.code==0){
                        this.dialogFormVisible = false;
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
                  }

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
                    deleteEnterpriseById(row.id).then(data=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.list.splice(this.list.indexOf(row), 1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
