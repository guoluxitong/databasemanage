<template>
  <div class="app-container">
    <div v-if="categoryVisibl==0">
    <el-row class="app-query">
      <el-col :span="2">
      <el-button  @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">

      <el-table-column :show-overflow-tooltip="true" align="left" label="辅机大类">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
    </el-table>
    <menu-context ref="menuContext">
      <menu-context-item @click="handleUpdate">编辑</menu-context-item>
      <menu-context-item @click="handleSelect">辅机小类</menu-context-item>
      <menu-context-item @click="handleDelete">删除</menu-context-item>
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
    </div>
    <div v-if="categoryVisibl==1">
      <el-row class="app-query">
        <el-col :span="22">
          <el-button  @click="handleCreate" type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-button  @click="canel" icon="el-icon-back" type="warning">取消</el-button>
        </el-col>
      </el-row>

      <el-table :data="subList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%" @row-contextmenu="openTableMenu">

        <el-table-column :show-overflow-tooltip="true" align="left" label="辅机小类">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleUpdate">编辑</menu-context-item>
        <menu-context-item @click="handleSubDelete">删除</menu-context-item>
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
    <div class="el-dialog-customer">
      <el-dialog :title="textMap[dialogorgType]" :visible.sync="dialogFormVisible" width="30%">
        <el-form :rules="rules" ref="categoryForm" :model="categoryFormData" label-position="right" label-width="80px" style='width: 90%; margin-left:15px;'>

          <el-form-item v-if="categoryVisibl==0" label="辅机大类" prop="name">
            <el-input v-model="categoryFormData.name"></el-input>
          </el-form-item>
          <el-form-item v-if="categoryVisibl==1" label="辅机小类" prop="name">
            <el-input v-model="categoryFormData.name"></el-input>
          </el-form-item>
          <el-form-item  label="排序" prop="sort">
            <el-input v-model="categoryFormData.sort"></el-input>
          </el-form-item>
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
  import { getCategoryList,createCategory,modifyCategory,removeCategory } from "@/api/category";
  import { getSubCategoryList,createSubCategory,modifySubCategory,removeSubCategory} from "@/api/subcategory";
    export default {
        data() {
            return {
              subList: [],
                list: [],
              currentPage1: 1,
              pageNum1: 1,
              pageSize1: 5,
                textMap: {
                    update: '编辑',
                    create: '新增'
                },
              partId: '',
              categoryVisibl:0,
                dialogorgType: '',
                dialogFormVisible: false,
              categoryFormData: {
                    name:'',
                    sort:'',
                },
                rules: {
                    name: [
                        { required: true, message: '辅机大类名称不能为空', trigger: 'blur' }
                    ],
                },
                listLoading: false,
            }
        },
        created() {
            Promise.all([this.initEnterpriseList()]).then(()=>{this.getList()})
        },
        methods: {
            openTableMenu(row, event) {
                this.$refs.menuContext.openTableMenu(row,event);
            },
            initEnterpriseList(){

            },
            handleFilter() {
                this.listQuery.pageNum = 1
                this.getList()
            },
          getSubList(){
            this.listLoading = true
            getSubCategoryList(this.partId).then(response => {
              if(response.data.code==0){
              this.subList = response.data.data
                this.listLoading = false
              }else {
                this.$message.error(response.data.msg)
                return
              }
            });
          },
            getList() {
                this.listLoading = true
              getCategoryList().then(response => {
                if(response.data.code==0){
                  this.list = response.data.data
                  this.listLoading = false
                }else {
                  this.$message.error(response.data.msg)
                  return
                }
              });
            },
            resetTemp() {
                this.categoryFormData = {
                    name:'',
                    sort:'',
                }
            },
          handleSelect(row){
            this.categoryVisibl=1;
            this.currentPage1=1;
            this.partId=row.id;
            this.getSubList()
          },
          canel(){
            this.categoryVisibl=0;
            this.currentPage1=1
          },
            handleCreate() {
                this.resetTemp()
                this.dialogorgType = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['categoryForm'].clearValidate()
                })
            },
            handleUpdate(row) {
                this.categoryFormData = Object.assign({}, row) // copy obj
                this.dialogorgType = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['categoryForm'].clearValidate()
                })
            },
            editData(){
                this.$refs.categoryForm.validate(valid => {
                    if (valid) {
                      if(this.categoryVisibl==0){
                        if( this.dialogorgType =='create'){
                          createCategory({
                            name:this.categoryFormData.name,
                            sort:this.categoryFormData.sort
                          }).then(data=>{
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
                          modifyCategory({
                            id:this.categoryFormData.id,
                            name:this.categoryFormData.name,
                            sort:this.categoryFormData.sort
                          }).then(data=>{
                            if(data.data.code==0){
                              this.dialogFormVisible = false
                              this.$message({
                                message: '成功',
                                type: 'success'
                              });
                              this.getList()
                            }else{
                              this.$message.error(data.data.msg)
                              return;
                            }
                          })
                        }
                      }else{
                        if( this.dialogorgType =='create'){
                          createSubCategory({
                            categoryId:this.partId,
                            name:this.categoryFormData.name,
                            sort:this.categoryFormData.sort
                          }).then(data=>{
                            if(data.data.code==0){
                              this.dialogFormVisible = false
                              this.$message({
                                message: '成功',
                                type: 'success'
                              });
                              this.getSubList()
                            }else{
                              this.$message.error(data.data.msg)
                              return
                            }
                          })
                        }else{
                          modifySubCategory({
                            id:this.categoryFormData.id,
                            categoryId:this.partId,
                            name:this.categoryFormData.name,
                            sort:this.categoryFormData.sort
                          }).then(data=>{
                            if(data.data.code==0){
                              this.dialogFormVisible = false
                              this.$message({
                                message: '成功',
                                type: 'success'
                              });
                              this.getSubList()
                            }else{
                              this.$message.error(data.data.msg)
                              return;
                            }
                          })
                        }
                      }

                    } else {
                        return false
                    }
                })
            },
          handleSubDelete(row){
            this.partId=row.id;
            this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              removeSubCategory(this.partId).then(data=>{
                if(data.data.code==0){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.currentPage1 =(this.subList.length-1)%this.pageSize1 == 0 ? this.currentPage1-1 : this.currentPage1
                  this.getSubList()
                }else{
                  this.$message.error(data.data.msg)
                  return
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
            handleDelete(row) {
              this.partId=row.id;
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  removeCategory(this.partId).then(data=>{
                    if(data.data.code==0){
                      this.$message({
                        message: '删除成功',
                        type: 'success'
                      });
                      this.currentPage1 =(this.subList.length-1)%this.pageSize1 == 0 ? this.currentPage1-1 : this.currentPage1
                      this.getList();
                    }else{
                      this.$message.error(data.data.msg)
                      return
                    }
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
