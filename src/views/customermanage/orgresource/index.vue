<template>
  <div class="app-container">
    <div v-if="resource==0">
      <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading"
                element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%"
                @row-contextmenu="openTableMenu">
        <el-table-column :show-overflow-tooltip="true" align="left" label="锅炉厂名称">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
          <template slot-scope="scope">
            <span v-for="item in statusArray" v-if="item.value==scope.row.status">{{item.label}}</span>
          </template>
        </el-table-column>

      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="handleUpdate">查看功能</menu-context-item>
        <menu-context-item @click="handleEditResource">分配功能</menu-context-item>
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
    </div>
    <div v-if="resource==1">
      <el-row class="resource-query">
        <el-col :offset="22" :span="2">
          <el-button @click="handleCancel" icon="el-icon-back" type="warning">取消</el-button>
        </el-col>
      </el-row>
      <el-table :data="data.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading"
                element-loading-text="给我一点时间" border>
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
          <span>
            {{(scope.row.pageUrl==''||scope.row.pageUrl==null)?'无':scope.row.pageUrl}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="是否隐藏">
          <template slot-scope="scope">
            <span v-for="item in statusArray" v-if="item.value==scope.row.hidden">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.sort}}</span>
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
          :total="data.length"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="分配权限" :visible.sync="dialogResourceFormVisible" width="20%">
      <el-form
        :rules="rules"
        ref="resourceForm"
        :model="resourceFormData"
        label-position="right"
        label-width="80px"
        style="width: 95% margin-left:2px"
      >
        <el-tree
          :data="resourceFormData.resourceList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="resourceFormData.defaultProps"
          :default-checked-keys="resourceFormData.resIdArray"
        ></el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editResource">确认</el-button>
        <el-button type="warning" icon="el-icon-back" @click="dialogResourceFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCustomerListByConditionAndPage} from '@/api/customer'
  import {getResourceList, map, getResoure} from '@/api/resource'

  export default {
    data() {
      const validateEnterpriseFun = (rule, value, callback) => {
        if (!value) {
          callback(new Error('所属企业不能为空'))
        } else {
          callback()
        }
      }
      return {
        list: [],
        resourceList: [],
        resourceSubList: [],
        data: [],
        listQuery: {
          total: 50,
          pageNum: 1,
          pageSize: 5,
          customerName: ""
        },
        rules: {},
        resourceFormData: {
          resIdArray: [],
          userId: "",
          roleId: null,
          orgId: '',
          resourceList: [],
          defaultProps: {
            children: "children",
            label: "label"
          }
        },
        dialogResourceFormVisible: false,
        resource: 0,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        statusArray: [
          {value: 0, label: '否'},
          {value: 1, label: '是'}
        ],

        enterpriseOption: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        menus: [],
        orgId: '',
        dialogStatus: '',
        dialogFormVisible: false,
        customerFormData: {
          id: '',
          customerName: '',
          status: 1,
        },
        rules: {
          enterpriseId: [
            {required: true, trigger: 'blur', validator: validateEnterpriseFun}
          ],
          customerName: [
            {required: true, message: '客户名称不能为空', trigger: 'blur'}
          ],
        },
        listLoading: true,
      }
    },
    created() {
      Promise.all([this.initEnterpriseList()]).then(() => {
        this.getList()
      })
    },
    methods: {
      /**
       * 由资源构建菜单
       * @param {资源列表} resources
       */
      generateMenusFromResources(resources = []) {
        if (resources) {
          let topMenus = [];
          let topResources = resources.filter(r => r.pId == 0);
          topResources.forEach(t => {
            let subResources = resources.filter(r => r.pId == t.id)
            let topMenu = {
              "id": t.id,
              "title": t.resName,
              "hasChilds": subResources.length != 0,
              "childs": [],
              "url": t.url,
              "pageUrl": t.pageUrl,
              "hidden": t.hidden
            }
            subResources.forEach(s => {
              let subMenu = {"id": s.id, "title": s.resName, "url": s.url, "pageUrl": s.pageUrl, "hidden": s.hidden}
              topMenu.childs.push(subMenu)
            })
            topMenus.push(topMenu)
          });
          return topMenus;
        }
        return [];
      },
      getResoure() {
        this.listLoading = true
        getResourceList().then(response => {
          if (response.data.code == 0) {
            this.menus=this.generateMenusFromResources(response.data.data)
            this.listLoading = false
          } else {
            this.$message.error(response.data.msg)
            return
          }
        })
      },
      checkContains(array, item) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] == item) return true;
        }
        return false;
      },
      editResource(row) {
        let orgResources = [];
        let checkIds = [];
        this.$refs.tree.getCheckedNodes().forEach(node => {
          checkIds.push(node.id);
        });
        this.resourceFormData.resourceList.forEach(m => {
          if (m.children.length > 0) {
            let ids = [];
            m.children.forEach(s => {
              if (this.checkContains(checkIds, s.id)) {
                ids.push(s.id);
              }
            });
            if (ids.length) {
              orgResources.push({orgId: this.resourceFormData.orgId, resId: m.id});
              ids.forEach(i => {
                orgResources.push({orgId: this.resourceFormData.orgId, resId: i});
              });
            }
          } else {
            if (this.checkContains(checkIds, m.id)) {
              orgResources.push({orgId: this.resourceFormData.orgId, resId: m.id});
            }
          }
        });
        map({orgId:this.resourceFormData.orgId, orgResources:orgResources})
          .then(response => {
            if (response.data.code) {
              this.resourceFormData.orgId = null;
              throw response.data.msg;
            } else {
              this.$message({
                message: "设置成功",
                type: "success"
              });
              this.dialogResourceFormVisible = false;
            }
          })
          .catch(resion => {
            this.$message.error(resion);
          });
      },
      handleEditResource(row) {
        this.resourceFormData.orgId=row.id;
        let resources = [];
        this.menus.forEach(m => {
          let resource = {};
          resource.id = m.id;
          resource.label = m.title;
          resource.children = [];
          m.childs.forEach(c => {
            let subResource = {};
            subResource.id = c.id;
            subResource.label = c.title;
            resource.children.push(subResource);
          });
          resources.push(resource);
        });
        this.$set(this.resourceFormData, "resourceList", resources);
        getResoure(row.id)
          .then(response => {
            let checkIds = [];
            let data = response.data;
            if (data.code) {
              throw data.msg;
            } else {
              data.data.forEach(r => {
                if (r.pId) {
                  checkIds.push(r.id);
                } else {
                  if (null != r.url && "" != r.url) {
                    checkIds.push(r.id);
                  }
                }
              });
              this.$set(this.resourceFormData, "resIdArray", checkIds);
              this.resourceFormData.roleId = row.id;
              this.dialogResourceFormVisible = true;
              if (this.$refs["tree"]) {
                this.$refs["tree"].setCheckedKeys(
                  this.resourceFormData.resIdArray
                );
              }
            }
          })
          .catch(resion => {
            this.$message.error(resion);
          });
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(row, event);
      },
      initEnterpriseList() {
        this.getResoure();
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        getCustomerListByConditionAndPage().then(response => {
          if (response.data.code == 0) {
            const data = response.data.data

            this.list = data

            this.listLoading = false
          } else {
            this.$message.error(response.data.msg)
            return
          }
        })
      },
      getResoureList() {
        this.listLoading = true
        getResoure(this.orgId).then(response => {
          if (response.data.code == 0) {
            this.data = response.data.data
            this.listLoading = false
          } else {
            this.$message.error(response.data.msg)
            return
          }
        })
      },
      handleCancel() {
        this.resource = 0;
        this.currentPage1 = 1
      },
      handleUpdate(row) {
        this.resource = 1;
        this.currentPage1 = 1
        this.orgId = row.id;
        this.getResoureList()
      },

      handleSizeChange1: function (pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function (currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      }
    }
  }
</script>
