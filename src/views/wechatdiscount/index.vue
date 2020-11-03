<template>
  <div class="app-container">
    <el-row class="app-query">
      <el-col :span="2">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column align="left" :show-overflow-tooltip="true" label="名称">
      <template slot-scope="scope">
        <span>{{scope.row.strategyName}}</span>
      </template>
    </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.strategyType==1?'打折':'满减'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="基数">
        <template slot-scope="scope">
          <span>{{scope.row.baseNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="折扣数">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="起始时间">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.startDatetime)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="结束时间">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.endDatetime)}}</span>
        </template>
      </el-table-column>

    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
    </menu-context>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[5]"  layout="total, sizes, prev, pager, next, jumper" :total="list.length">
      </el-pagination>
    </div>
    <div class="el-dialog-device">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form  :model="discountList" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目">
                <el-input v-model="discountList.strategyName" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基数">
                <el-input v-model="discountList.baseNumber" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="折扣数">
                <el-input v-model="discountList.discount" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型">
                <el-select clearable class="filter-item" v-model="discountList.strategyType"  style="width: 100%">
                  <el-option v-for="item in discountTypeArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item label="开始时间">
                <el-date-picker
                  value-format="yyyy-MM-dd hh:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                  v-model="discountList.startDatetime"
                  :default-value="discountList.startDatetime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间">
                <el-date-picker
                  value-format="yyyy-MM-dd hh:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                  v-model="discountList.endDatetime"
                  :default-value="discountList.endDatetime"
                  style="width: 100%;"
                ></el-date-picker>
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
  import {getWeChatList,editWeChat,addWeChat} from '@/api/wechatdiscount'
  import {getCustomerListByEnterpriseId} from '@/api/token-dict'
  import {getDeviceTypeList} from '@/api/device-type'
  export default {
    data() {
      return {
        list: [],
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        discountList:{
          id:null,
          strategyName:null,
          baseNumber:null,
          discount:null,
          strategyType:null,
          startDatetime:null,
          endDatetime:null
        },
        ResourceArray:[],
        ResourceList:[],
        discountTypeArray:[
          {
            value:0,
            label:'满减'
          },
          {
            value:1,
            label:'打折'
          }
        ],
        discountTypeList:[],
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
      dateFormat: function(time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return (
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds
        );
      },
      querySearchAsyncuser1(queryString, callback) {
        var results = [];
        for (let i = 0, len = this.discountTypeArray.length; i < len; i++) {
          this.discountTypeArray[i].value = this.discountTypeArray[i].name;
        }
        this.discountTypeList = this.discountTypeArray;
        results = queryString ? this.discountTypeList.filter(this.createFilteruser1(queryString)) : this.discountTypeList;
        callback(results);
      },

      createFilteruser1(queryString, queryArr) {
        return (queryArr) => {
          return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectuser1(item) {
        this.discountList.StrategyType=item.id
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(
          row,
          event,
          window.event.clientX,
          window.event.clientY
        );
      },
      getList() {
        this.listLoading = true
        getWeChatList().then(response => {
          const data=response.data.data
          this.list=data
          this.listLoading = false
        })
      },

      resetTemp() {
        this.discountList = {
          strategyName:null,
          baseNumber:null,
          discount:null,
         strategyType:null,
          startDatetime:null,
          endDatetime:null
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true

      },
      handleUpdate(row) {
        this.discountList = row
        this.discountList.startDatetime=new Date(this.discountList.startDatetime)
        this.discountList.endDatetime=new Date(this.discountList.endDatetime)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },

      editData(){
        var StartDatetime = new Date(this.discountList.startDatetime);
        var EndDatetime = new Date(this.discountList.endDatetime)
        if(this.dialogStatus == 'create'){
          addWeChat({
              strategyName:this.discountList.strategyName,
              baseNumber:parseInt(this.discountList.baseNumber),
              discount:parseInt(this.discountList.discount),
              strategyType:parseInt(this.discountList.strategyType),
              startDatetime:StartDatetime,
              endDatetime:EndDatetime
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
              id:this.discountList.id,
              strategyName:this.discountList.strategyName,
              baseNumber:parseInt(this.discountList.baseNumber),
              discount:parseInt(this.discountList.discount),
              strategyType:parseInt(this.discountList.strategyType),
              startDatetime:StartDatetime,
              endDatetime:EndDatetime
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
