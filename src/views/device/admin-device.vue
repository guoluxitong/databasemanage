<template>
  <div class="app-container">
    <el-row class="app-query">
      <el-row>
        <el-select clearable class="filter-item" v-model="listQuery.enterpriseId"  style="width: 150px;" placeholder="所属企业" @change="initCustomerList(listQuery.enterpriseId)">

          <el-option v-for="item in enterpriseOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select clearable class="filter-item" v-model="listQuery.customerNo"  style="width: 150px;" placeholder="所属客户">
          <el-option v-for="item in customerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select clearable class="filter-item" v-model="listQuery.power"  style="width: 150px;" placeholder="燃料">
          <el-option v-for="item in fuelArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select clearable class="filter-item" v-model="listQuery.media"  style="width: 150px;" placeholder="介质">
          <el-option v-for="item in mediumArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select clearable class="filter-item" v-model="listQuery.status"  style="width: 150px;" placeholder="是否销售">
          <el-option v-for="item in isOrNotArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-row>
      <el-row>
        <el-select clearable class="filter-item" v-model="listQuery.runStatus"  style="width: 150px;" placeholder="是否运行">
          <el-option v-for="item in isOrNotArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input clearable v-model="listQuery.deviceSuffix" placeholder="设备编号"  style="width: 150px;"></el-input>
        <el-date-picker v-model="listQuery.importDatetime" type="date" value-format="yyyy-MM-dd hh:mm:ss" placeholder="创建时间" style="width: 150px;"></el-date-picker>
        <el-date-picker v-model="listQuery.saleDatetime" type="date" value-format="yyyy-MM-dd hh:mm:ss" placeholder="销售时间" style="width: 150px;"></el-date-picker>
        <el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button  @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
       <!-- <el-button  @click="handleEncryptionDevice" type="primary" icon="el-icon-edit">加密</el-button>
        <el-button  type="primary" icon="el-icon-circle-plus-outline" @click="handleGenerateQRCode">生成二维码</el-button>-->
      </el-row>
    </el-row>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column align="left" :show-overflow-tooltip="true" label="设备编号">
        <template slot-scope="scope">
          <span>{{scope.row.deviceSuffix}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="加密编号">
        <template slot-scope="scope">
          <span>{{scope.row.deviceNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="所属客户">
        <template slot-scope="scope">
         <span v-for="item in customerOption" v-if="scope.row.deviceSuffix.substring(0,5)==item.value">{{item.label}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="燃料">
        <template slot-scope="scope">
          <span v-if="scope.row.power!=null">
            <span v-for="item in fuelArray"  v-if="scope.row.power==item.value">{{item.label}}</span>
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="介质">
        <template slot-scope="scope">
          <span v-if="scope.row.media!=null">
            <span v-for="item in mediumArray"  v-if="scope.row.media==item.value">{{item.label}}</span>
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="设备类型">
        <template slot-scope="scope">
          <span>{{scope.row.deviceType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="是否销售">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilterLabel(isOrNotArray)[0].label}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="是否运行">
        <template slot-scope="scope">
          {{scope.row.runStatus | statusFilterLabel(isOrNotArray)[0].label}}
        </template>
      </el-table-column>
   <!--   <el-table-column align="left" :show-overflow-tooltip="true"  label="是否在线">
        <template slot-scope="scope">
          {{scope.row.onlineStates | statusFilterLabel(isOrbool)[0].label}}
        </template>
      </el-table-column>-->
      <el-table-column align="left" :show-overflow-tooltip="true"  label="销售时间">
        <template slot-scope="scope">
          <span>{{scope.row.saleDatetime==null?'无':scope.row.saleDatetime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.importDatetime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <menu-context-item @click="handleDelete">删除</menu-context-item>
    </menu-context>
   <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>-->
    <div class="el-dialog-device">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form :rules="rules" ref="deviceFormData" :model="deviceFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属企业" prop="enterpriseId">
                <el-select clearable class="filter-item" v-model="deviceFormData.enterpriseId"  style="width: 100%;">
                  <el-option v-for="item in enterpriseOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select class="filter-item" v-model="deviceFormData.deviceType"  style="width: 100%">
                  <el-option v-for="item in deviceTypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="燃料">
                <el-select clearable class="filter-item" v-model="deviceFormData.power"  style="width: 100%">
                  <el-option v-for="item in fuelArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="介质">
                <el-select clearable class="filter-item" v-model="deviceFormData.media"  style="width: 100%">
                  <el-option v-for="item in mediumArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否销售">
                <el-select class="filter-item" v-model="deviceFormData.status"  style="width: 100%">
                  <el-option v-for="item in isOrNotArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否运行">
                <el-select class="filter-item" v-model="deviceFormData.runStatus"  style="width: 100%">
                  <el-option v-for="item in isOrNotArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间" prop="importDatetime">
                <el-date-picker type="datetime" v-model="deviceFormData.importDatetime" :default-value="new Date()" style="width: 100%;" default-time="00:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="deviceFormData.id">
              <el-form-item label="售出时间">
                <el-date-picker type="datetime" v-model="deviceFormData.saleDatetime" style="width: 100%;" default-time="00:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="deviceFormData.id==''">
            <el-col :span="12">
              <el-form-item label="开始编号" prop="startDeviceSuffix">
                <el-input v-model="deviceFormData.startDeviceSuffix" @change="calculateStartSuffixAndEndSuffix"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束编号" prop="endDeviceSuffix">
                <el-input v-model="deviceFormData.endDeviceSuffix"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="加密编号">
                <el-input v-model="deviceFormData.deviceNo" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateData" v-if="deviceFormData.id">确认</el-button>
          <el-button type="primary" @click="insertManyData" v-else>确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="生成二维码" :visible.sync="dialogQRCodeFormVisible" width="30%">
        <el-form :rules="qRCodeRules" ref="qRCodeForm" :model="qRCodeFormData" label-position="right" label-width="80px" style='width: 80%; margin-left:30px;'>
          <el-form-item label="开始编号" prop="startSuffix">
            <el-input v-model="qRCodeFormData.startSuffix"></el-input>
          </el-form-item>
          <el-form-item label="结束编号" prop="endSuffix">
            <el-input v-model="qRCodeFormData.endSuffix"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogQRCodeFormVisible = false">取消</el-button>
          <el-button type="primary" @click="generateQRCode">生成</el-button>
        </div>
      </el-dialog>
      <el-dialog title="加密" :visible.sync="dialogEncryptionFormVisible" width="25%">
        <el-form ref="encryptionForm" :model="encryptionFormData" label-position="right" label-width="50px" style='width: 90%;'>
          <el-form-item label="内容">
            <el-input v-model="encryptionFormData.encryptionDeviceStr" type="textarea"  :rows="12"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEncryptionFormVisible = false">取消</el-button>
          <el-button type="primary" @click="encryptionDevice">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fuelArray,mediumArray} from '@/utils/common'
  import {formatDateTime} from '@/utils/date'
  import {pad} from '@/utils/common'
  import {getDeviceListByConditionAndPage,insertManyDevice,updateManyDeviceNo,editDevice,deleteDeviceById} from '@/api/device'
  import {getEnterpriseListByConditionAndPage} from '@/api/enterprise'
  import {getCustomerListByConditionAndPage} from '@/api/customer'
  import {getDeviceTypeList} from '@/api/device-type'
  /* 正数、负数、和小数*/
  function validateDeviceNo(textval) {
    const urlregex = /^[0-9]\d{9}$/
    return urlregex.test(textval)
  }
  /**
   * 过滤JS数组中的空值,假值等(es6语法)
   * @param array 需要过滤的数组
   * @returns {Array} []
   */
  function filter_array(array) {
    return array.filter(item=>item);
  }
  export default {
    data() {
      const validateEnterpriseFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('所属企业不能为空'))
        } else {
          callback()
        }
      }
      const validateDeviceTypeFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('设备类型不能为空'))
        }else{}
          callback()
      }
      const validateDeviceNoFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('编号不能为空'))
        } else if(!validateDeviceNo(value)) {
          callback(new Error('格式不正确（10位数的正整数，包括0）'))
        }else{}
        callback()
      }
      return {
        list: null,
        listQuery: {
          total:50,
          pageNum:1,
          pageSize:5,
          deviceSuffix:null,
          deviceNo:null,
          media:null,
          power:null,
          customerNo:null,
          enterpriseId:null,
          status:null,
          runStatus:null,
          saleDatetime:null,
          importDatetime:null,
          onlineStates:null
        },
        enterpriseOption:[],
        customerOption:[],
        isOrNotArray:[
          {value:1,label:'是'},
          {value:0,label:'否'}
        ],

        fuelArray:fuelArray,
        mediumArray:mediumArray,
        deviceTypeOption:[],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        deviceFormData: {
          id:'',
          enterpriseId:'',
          media:'',
          power:'',
          deviceType:'',
          status:0,
          runStatus:0,
          importDatetime:'',
          saleDatetime:'',
          startDeviceSuffix:'',
          endDeviceSuffix:'',
         /* onlineStates:0,*/
        },
        rules: {
          enterpriseId: [{required: true,trigger: 'blur',validator: validateEnterpriseFun }],
          deviceType: [{required: true,  trigger: 'blur',validator: validateDeviceTypeFun }],
          importDatetime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          startDeviceSuffix: [
            { required: true, trigger: 'blur',validator: validateDeviceNoFun }
          ],
          endDeviceSuffix: [
            { required: true, trigger: 'blur',validator: validateDeviceNoFun }
          ]
        },
        dialogQRCodeFormVisible:false,
        qRCodeFormData:{
          startSuffix:'',
          endSuffix:''
        },
        qRCodeRules: {
          startSuffix: [
            { required: true, message: '开始编号不能为空', trigger: 'blur' }
          ],
          endSuffix: [
            { required: true, message: '结束编号不能为空', trigger: 'blur' }
          ]
        },
        dialogEncryptionFormVisible:false,
        encryptionFormData:{
          encryptionDeviceStr:''
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
      //this.getList()
      this.initEnterpriseList()
      this.initCustomerList()
      // this.initDeviceTypeList()
    },
    methods: {
      initEnterpriseList(){
        let enterpriseOption=[]
        getEnterpriseListByConditionAndPage().then(response=>{
          console.log(response)
          data.data.data.forEach(item=>{
            enterpriseOption.push({value:item.id,label:item.enterpriseName})
          })
          this.enterpriseOption=enterpriseOption
        })

      },
      initCustomerList(val){
        let customerOption=[]
        getCustomerListByConditionAndPage(val).then(data=>{
          console.log(data)
          data.data.data.forEach(item=>{
            customerOption.push({value:item.code+"",label:item.name})
          })
          this.customerOption=customerOption
        })
      },
      initDeviceTypeList(){
        let deviceTypeOption=[]
        getDeviceTypeList().then(data=>{
          data.data.data.forEach(item=>{
            deviceTypeOption.push({value:item.deviceType,label:item.deviceType})
          })
          this.deviceTypeOption=deviceTypeOption
        })
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row,event);
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getDeviceListByConditionAndPage(this.listQuery).then(response => {
          const data=response.data.data
          this.list=data.list
          this.listQuery.total=data.total
          this.listQuery.pageNum=data.pageNum
          this.listQuery.pageSize=data.pageSize
          this.listLoading = false
        })
      },
      resetTemp() {
        this.deviceFormData = {
          id:'',
          enterpriseId:'',
          media:'',
          power:'',
          deviceType:'',
          status:0,
          runStatus:0,
          importDatetime:new Date(),
          startDeviceSuffix:'',
          endDeviceSuffix:'',
          /*onlineStates:0*/
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
      handleEncryptionDevice(row) {
        this.encryptionFormData = Object.assign({}, row) // copy obj
        this.dialogEncryptionFormVisible = true
        this.$nextTick(() => {
          this.$refs['encryptionForm'].clearValidate()
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
        this.deviceFormData = Object.assign({}, row)
        if(this.deviceFormData.saleDatetime){
          this.deviceFormData.saleDatetime=new Date(this.deviceFormData.saleDatetime)
        }
        if(this.deviceFormData.importDatetime){
          this.deviceFormData.importDatetime=new Date(this.deviceFormData.importDatetime)
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['deviceFormData'].clearValidate()
        })
      },
      encryptionDevice() {
        if(this.encryptionFormData.encryptionDeviceStr){
          let data=filter_array(this.encryptionFormData.encryptionDeviceStr.split("\n"))
          let deviceList=[];
          data.forEach(item=>{
            deviceList.push({deviceSuffix:item.substring(0,item.indexOf("-")),deviceNo:item.substring(item.indexOf("-")+1,item.length)})
          })
          updateManyDeviceNo(deviceList).then(data=>{
            this.dialogEncryptionFormVisible = false
            this.$message({
              message: data.data.msg,
              type: 'success'
            });
            this.getList()
          })
        }else{

        }
      },
      generateQRCode(){
        this.$refs.qRCodeForm.validate(valid => {
          if (valid) {
            this.dialogQRCodeFormVisible = false
            window.open(process.env.BASE_API+'/device/generateqrcode?startSuffix='+this.qRCodeFormData.startSuffix+'&endSuffix='+this.qRCodeFormData.endSuffix, "_blank");
          } else {
            return false
          }
        })
      },
      calculateStartSuffixAndEndSuffix(){
        if(this.deviceFormData.startDeviceSuffix&&this.deviceFormData.startDeviceSuffix.length==10){
          this.deviceFormData.endDeviceSuffix=this.deviceFormData.startDeviceSuffix.substring(0,5)+pad(Number(this.deviceFormData.startDeviceSuffix.substring(5,10))+50,5)
        }
      },
      dealDate(){
        if(this.deviceFormData.saleDatetime){
          this.deviceFormData.saleDatetime=formatDateTime(this.deviceFormData.saleDatetime,"yyyy-MM-dd hh:mm:ss")
        }
        if(this.deviceFormData.importDatetime){
          this.deviceFormData.importDatetime=formatDateTime(this.deviceFormData.importDatetime,"yyyy-MM-dd hh:mm:ss")
        }
      },
      insertManyData(){
        this.$refs.deviceFormData.validate(valid => {
          if (valid) {
            this.dealDate()
            let deviceNoPrefix=this.deviceFormData.startDeviceSuffix.substring(0,5)
            let startNum=Number(this.deviceFormData.startDeviceSuffix.substring(5,10))
            let endNum=Number(this.deviceFormData.endDeviceSuffix.substring(5,10))
            delete this.deviceFormData.startDeviceSuffix
            delete this.deviceFormData.endDeviceSuffix
            let deviceList=[];
            while (startNum<=endNum){
              let deviceFormData=Object.assign({}, this.deviceFormData)
              deviceFormData.areaId=100101001
              deviceFormData.manufacturerId=1
              deviceFormData.devicePrefix=1
              deviceFormData.deviceSuffix=deviceNoPrefix+pad(startNum,5)
              deviceFormData.deviceNo=deviceNoPrefix+pad(startNum,5)
              deviceList.push(deviceFormData)
              startNum++
            }
           insertManyDevice(deviceList).then(data=>{
              this.dialogFormVisible = false
              this.$message({
                message: data.data.msg,
                type: 'success'
              });
              this.getList()
            })
          } else {
            return false
          }
        })
      },
      updateData(){
        this.$refs.deviceFormData.validate(valid => {
          this.dealDate()
          editDevice(this.deviceFormData).then(data=>{
            this.dialogFormVisible = false
            this.$message({
              message: "成功",
              type: 'success'
            });
            this.getList()
          })
        })
      },
      handleDelete(row) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeviceById(row.id).then(data=>{
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
<style>
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
