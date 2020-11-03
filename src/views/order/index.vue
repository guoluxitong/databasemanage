<template>
  <div>
  <div v-if="orderVisible===0" class="app-container">
    <el-row class="app-query">
      <el-col :span="2">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">
      <el-table-column align="left" :show-overflow-tooltip="true" label="订单号">
      <template slot-scope="scope">
        <span>{{scope.row.wechatOrderId}}</span>
      </template>
    </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="微信昵称">
        <template slot-scope="scope">
          <span>{{scope.row.wxNickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="订单总价">
        <template slot-scope="scope">
          <span>{{scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="支付金额">
        <template slot-scope="scope">
          <span>{{scope.row.paymentAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="折扣信息">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="支付日期">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.payforDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="下单日期">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.createDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="订单状态">
        <template slot-scope="scope">
          <span>{{scope.row.status==0?"待支付":"已付款"}}</span>
        </template>
      </el-table-column>
    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="goOrderItem">订单详情</menu-context-item>
    </menu-context>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[5]"  layout="total, sizes, prev, pager, next, jumper" :total="list.length">
      </el-pagination>
    </div>
    <div class="el-dialog-device">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
        <el-form  :model="orderList" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号">
                <el-input v-model="orderList.moblie" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单号">
                <el-input v-model="orderList.wechatOrderId" ></el-input>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单总价">
                <el-input v-model="orderList.total" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付金额">
                <el-input v-model="orderList.paymentAmount" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item label="折扣信息">
                <el-input v-model="orderList.discount" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微信昵称">
                <el-input v-model="orderList.wxNickName" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="下单日期">
                <el-date-picker
                  value-format="yyyy-MM-dd hh:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                  v-model="orderList.createDate"
                  :default-value="orderList.createDate"
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
    <div v-if="orderVisible===1" class="app-container">
      <el-row class="app-query">
        <el-col :span="2">
          <el-button style="margin-left: 10px;" @click="handleCreateItem" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :offset="19" :span="2">
          <el-button  @click="handleCancel" icon="el-icon-back" type="warning" >取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="itemList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" >
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
        <el-table-column align="left" :show-overflow-tooltip="true"  label="数量">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true"  label="设备编号">
          <template slot-scope="scope">
            <span>{{scope.row.deviceNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true"  label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" :show-overflow-tooltip="true"  label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.marker}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[5]"  layout="total, sizes, prev, pager, next, jumper" :total="list.length">
        </el-pagination>
      </div>
      <div class="el-dialog-device">
        <el-dialog :title="textMap[itemDialogStatus]" :visible.sync="itemDialogFormVisible" width="40%">
          <el-form  :model="orderItemList" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>
            <el-row>
              <el-col :span="12">
                <el-form-item label="购买项目">
                  <el-autocomplete
                    v-model="orderItemList.resourceName"
                    :fetch-suggestions="querySearchAsyncuser"
                    placeholder="购买项目"
                    @select="((item)=>{handleSelectuser(item)})"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="时间类型">
                  <el-select clearable class="filter-item" v-model="orderItemList.rangeType"  style="width: 100%">
                    <el-option v-for="item in timeTypeArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="价格">
                  <el-input v-model="orderItemList.price" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="时长">
                  <el-input v-model="orderItemList.range" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号">
                  <el-input v-model="orderItemList.moblie" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量">
                  <el-input v-model="orderItemList.amount" ></el-input>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备编号">
                  <el-input v-model="orderItemList.deviceNo" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="orderItemList.marker" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="itemEditData">确认</el-button>
            <el-button icon="el-icon-back" type="warning" @click="itemDialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import {getorderList,addorder,getUserList} from '@/api/order'
  import {getorderItemList,addItemOrder} from '@/api/orderItem'
  import {getResourceList} from '@/api/wechat'
  export default {
    data() {
      return {
        list: [],
        itemList:[],
        orderVisible:0,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        ResourceArray:[],
        ResourceList:[],
        orderList:{
          wxNickName:null,
          moblie:null,
          id:null,
          wechatOrderId:null,
          openId:null,
          unionId:null,
          total:null,
          paymentAmount:null,
          discount:null,
          payforDate:null,
          status:null,
          createDate:null
        },
        orderId:null,
        orderItemList:{
          orderId:null,
          resourceId:null,
          resourceName:null,
          range:null,
          price:null,
          amount:null,
          deviceNo:null,
          moblie:null,
          marker:null,
          rangeType:null,
        },
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
        discountTypeList:[],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        itemDialogStatus: '',
        dialogFormVisible: false,
        itemDialogFormVisible: false,
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
      goOrderItem(row){
        this.orderId=row.id
        getorderItemList({
          OrderId:this.orderId
        }).then(response => {
          const data=response.data.data
          this.itemList=data
        })
        this.orderVisible=1
        this.pageNum1=1
      },
      handleCancel(){
        this.orderVisible=0
        this.pageNum1=1
      },
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
        this.orderItemList.resourceId=(item.id).toString()
        this.orderItemList.resourceName=item.resName
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
        getorderList().then(response => {
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
        this.orderList = {
          id:null,
          wxNickName:null,
          moblie:null,
          wechatOrderId:null,
          openId:null,
          unionId:null,
          total:null,
          paymentAmount:null,
          discount:null,
          payforDate:null,
          status:null,
          createDate:null
        }
        this.orderItemList = {
          orderId:null,
          resourceId:null,
          resourceName:null,
          range:null,
          price:null,
          amount:null,
          deviceNo:null,
          moblie:null,
          marker:null,
          rangeType:null,
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true

      },
      handleCreateItem() {
        this.resetTemp()
        this.itemDialogStatus = 'create'
        this.itemDialogFormVisible = true

      },
      editData(){
        getUserList(this.orderList.moblie).then(response => {
          const data=response.data.data
          this.orderList.openId=data.weiXin
          this.orderList.unionId=data.unionId
        }).then(data=>{
          var createDate = new Date(this.orderList.createDate)
          addorder({
              wechatOrderId:this.orderList.wechatOrderId,
              moblie:this.orderList.moblie,
            wxNickName:this.orderList.wxNickName,
              openId:this.orderList.openId,
              unionId:this.orderList.unionId,
              total:parseInt(this.orderList.total),
              paymentAmount:parseInt(this.orderList.paymentAmount),
              discount:this.orderList.discount,
              status:0,
              createDate:createDate
            }
          )
        })
       .then(data=>{
            this.dialogFormVisible = false
            this.$message({
              message: "成功",
              type: 'success'
            });
            this.getList()
          })
      },
      itemEditData(){
         this.orderItemList.orderId=(this.orderId).toString()
        this.orderItemList.rangeType=(this.orderItemList.rangeType).toString()
        var itemList=[]
        itemList.push(this.orderItemList)

        addItemOrder(
          itemList
        ).then(data=>{
            this.itemDialogFormVisible = false
            this.$message({
              message: "成功",
              type: 'success'
            });
            this.getList()
          })
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
