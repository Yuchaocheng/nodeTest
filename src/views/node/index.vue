<template>
  <div class="node">
    <el-button size="mini" @click="addStudent" type="danger">新 增</el-button>
    <el-table :data="tableData" border style="width: 100%;margin-top:10px;">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="sex" label="性别">
      </el-table-column>
      <el-table-column prop="age" label="年龄">
      </el-table-column>
      <el-table-column prop="telphone" label="电话">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope='scope'>
          <el-button size="mini" @click="lookover(scope.row.id)" type="primary">查看</el-button>
          <el-button size="mini" @click="edit(scope.row)" type="primary">修改</el-button>
          <el-button size="mini" @click="deleteFun(scope.row.id)" type="danger">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page" layout="prev, pager, next" :total="total" :page-size="pageSize"
      :current-page="pageNo" @current-change="pageNoChange">
    </el-pagination>
    <yw-dialog :visible.sync="dialogVisible" title="新增学生信息" width="400" left="5%" top="16%">
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="姓名：" prop='name'>
          <el-input size="small" v-model="form.name" :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop='sex'>
          <el-radio v-model="form.sex" label="男" :disabled='isReadonly'>男</el-radio>
          <el-radio v-model="form.sex" label="女" :disabled='isReadonly'>女</el-radio>
        </el-form-item>
        <el-form-item label="年龄：" prop='age'>
          <el-input size="small" v-model="form.age" :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop='telphone'>
          <el-input size="small" v-model="form.telphone" :readonly="isReadonly"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-foot">
          <el-button size="mini" type="primary" @click='save' v-if="!isReadonly">确定</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </div>
      </template>
    </yw-dialog>
  </div>
</template>

<script>
import CusInput from "@com/common/CusInput.vue"
import YwDialog from "@com/common/YwDialog.vue"
export default {
  components: {
    YwDialog,
    CusInput
  },
  data() {
    return {
      isReadonly: false,
      saveId: "",
      tableData: [],
      total: 0,
      pageNo: 1,
      pageSize: 5,
      dialogVisible: false,
      form: {
        name: "",
        sex: "",
        age: "",
        telphone: "",
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    /* 查询 */
    getTableData() {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$axios.post('/students/query', data).then(res => {
        if (res.data.ok) {
          this.tableData = res.data.info.data
          this.total = res.data.info.total
          this.pageNo = res.data.info.pageNo
        } else {
          throw new Error(res.data.message)
        }
      }).catch(err => {
        throw new Error(err)
      })
    },
    /* 新增 */
    addStudent() {
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = ""
        }
      }
      this.dialogVisible = true
    },
    /* 删除 */
    deleteFun(id) {
      this.$axios.post('/students/delete', { id }).then(res => {
        if (res.data.ok) {
          this.getTableData()
          this.$message.success(res.data.message)
        }
      }).catch(err => {
        throw new Error(err)
      })
    },
    /* 修改 */
    edit(row) {
      this.dialogVisible = true;
      this.form = row
    },
    /* 查看 */
    lookover(id) {
      this.$axios.post('/students/findById', { id }).then(res => {
        if (res.data.ok) {
          this.isReadonly = true
          this.form = res.data.info
          this.dialogVisible = true
        }
      }).catch(err => {
        throw new Error(err)
      })
    },
    /* 分页 */
    pageNoChange(val) {
      this.pageNo = val
      this.getTableData()
    },
    close() {
      this.isReadonly = false
      this.dialogVisible = false;
    },
    save() {
      this.$axios.post('/students/add', this.form).then(res => {
        if (res.data.ok) {
          this.getTableData()
          this.$message.success(res.data.message)
          this.close()
        }
      }).catch(err => {
        throw new Error(err)
      })
    }
  },
}
</script>

<style scoped lang="scss">
.node {
  padding: 100px;
  .page {
    text-align: center;
  }
  .form-item {
    display: flex;
    align-items: center;
    > span {
      flex: 0 100px;
      text-align: right;
    }
  }
}
.dialog-foot {
  padding-top: 6px;
  height: 100%;
  text-align: right;
}
</style>
