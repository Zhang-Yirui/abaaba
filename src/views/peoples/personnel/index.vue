<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['peoples:personnel:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['peoples:personnel:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['peoples:personnel:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['peoples:personnel:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="personnelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="序号主键自增" align="center" prop="id" />-->
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="昵称" align="center" prop="nickname"/>
      <el-table-column label="头像" align="center" prop="avatar" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phoneNumber"/>
      <el-table-column label="职务" align="center" prop="positionName"/>
      <el-table-column label="银行卡卡号" align="center" prop="bankCardNumber"/>
      <el-table-column label="银行卡姓名" align="center" prop="bankCardName"/>
      <el-table-column label="银行卡开户行" align="center" prop="bankCardBranch"/>
      <el-table-column label="支付宝账号" align="center" prop="alipayAccount"/>
      <el-table-column label="支付宝实名姓名" align="center" prop="alipayRealName"/>
      <el-table-column label="微信收款码" align="center" prop="wechatPaymentCode" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.wechatPaymentCode" :width="50" :height="50"/>
        </template>
      </el-table-column>

      <el-table-column label="树状关系图" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" circle @click="handleSelect(scope.row)"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="我的邀请码" align="center" prop="invitationCode" width="100"/>



      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-search" @click="salesDetails(scope.row)">本月销售详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['peoples:personnel:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['peoples:personnel:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="职务" prop="positionId">
          <el-select v-model="form.positionId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.positionId"
              :label="item.label"
              :value="item.positionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡卡号" prop="bankCardNumber">
          <el-input v-model="form.bankCardNumber" placeholder="请输入银行卡卡号"/>
        </el-form-item>
        <el-form-item label="银行卡姓名" prop="bankCardName">
          <el-input v-model="form.bankCardName" placeholder="请输入银行卡姓名"/>
        </el-form-item>
        <el-form-item label="银行卡开户行" prop="bankCardBranch">
          <el-input v-model="form.bankCardBranch" placeholder="请输入银行卡开户行"/>
        </el-form-item>
        <el-form-item label="支付宝账号" prop="alipayAccount">
          <el-input v-model="form.alipayAccount" placeholder="请输入支付宝账号"/>
        </el-form-item>
        <el-form-item label="支付宝实名姓名" prop="alipayRealName">
          <el-input v-model="form.alipayRealName" placeholder="请输入支付宝实名姓名"/>
        </el-form-item>
        <el-form-item label="微信收款码" prop="wechatPaymentCode">
          <image-upload v-model="form.wechatPaymentCode"/>
        </el-form-item>
        <el-form-item label="上下级树状图" prop="superiorId">
          <el-input v-model="form.superiorId" placeholder="请输入上下级树状图"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="人员关系图"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-table
        :data="treeData"
        style="width: 100%"
      >
        <el-table-column
          prop="avatar"
          label="头像"
          width="180">
          <template slot-scope="scope">
            <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="职务">
        </el-table-column>
        <el-table-column label="上下级关系">
          <template slot-scope="scope">
            <span v-if="scope.row.positionId - rowPositionId == -1">直接上级</span>
            <span v-else-if="scope.row.positionId - rowPositionId == 1">直接下级</span>
            <span v-else-if="scope.row.positionId > rowPositionId">下级</span>
            <span v-else-if="scope.row.positionId < rowPositionId">上级</span>
            <span v-else-if="scope.row.positionId == rowPositionId">平级</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="Synthesize"
      width="30%"
      :before-close="handleClose">
      <el-row type="flex" justify="space-between" align="middle" style="margin-left: 40px">
        <el-col>
          <span>本月销售总额：</span>
          <strong class="sales-total">{{ salesMonth ? salesMonth : 0 }}元</strong>
        </el-col>
        <el-col>
          <span>本月提成总额：</span>
          <strong class="commission-total">{{ commissionsMonth ? salesMonth : 0 }}元</strong>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-col :span="24">
          <h3 style="text-align: center;">本月商品销售表</h3>
        </el-col>
      </el-row>

      <el-table
        :data="productsList"
        style="width: 100%;margin-top: 10px;margin-left: 20px">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          width="150">
        </el-table-column>
        <el-table-column label="商品图片" align="center" prop="productImage" width="100">
          <template slot-scope="scope">
            <image-preview :src="scope.row.productImage" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="销售数量"
          width="100">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="Synthesize = false">取 消</el-button>
    <el-button type="primary" @click="Synthesize = false">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  listPersonnel,
  getPersonnel,
  delPersonnel,
  addPersonnel,
  updatePersonnel,
  selectAllSuById
} from "@/api/peoples/personnel";
import {salesDetails} from "@/api/orders/manage";

export default {
  name: "Personnel",
  data() {
    return {
      value:false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户列表表格数据
      personnelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        phoneNumber: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nickname: [
          {required: true, message: "昵称不能为空", trigger: "blur"}
        ],
        phoneNumber: [
          {required: true, message: "手机号不能为空", trigger: "blur"}
        ],
        positionId: [
          {required: true, message: "职务不能为空", trigger: "change"}
        ],
      },
      options: [{
        positionId: '1',
        label: '总经理'
      }, {
        positionId: '2',
        label: '销售部经理'
      }, {
        positionId: '3',
        label: '区域经理'
      }, {
        positionId: '4',
        label: '区域销售经理'
      }, {
        positionId: '5',
        label: '销售人员'
      }],
      treeData: [],
      dialogVisible: false,
      showColumn: false,
      rowPositionId: '',
      salesMonth: '',
      commissionsMonth: '',
      productsList: [],
      Synthesize: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表列表 */
    getList() {
      this.loading = true;
      listPersonnel(this.queryParams).then(response => {
        this.personnelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nickname: null,
        avatar: null,
        phoneNumber: null,
        positionId: null,
        bankCardNumber: null,
        bankCardName: null,
        bankCardBranch: null,
        alipayAccount: null,
        alipayRealName: null,
        wechatPaymentCode: null,
        superiorId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPersonnel(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户列表";
      });
    },
    /** 查看树状图*/
    handleSelect(row) {
      console.log('aaaaaaaaaaa', row.id)
      console.log(this.treeData)
      this.rowPositionId = row.positionId;
      const id = row.id;
      const superiorId = row.superiorId;
      selectAllSuById(id, superiorId).then(response => {
        this.treeData = response.rows;
        this.treeData.sort((a, b) => a.positionId - b.positionId);
      })
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    handleNodeClick(data) {
      console.log(data);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePersonnel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPersonnel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户列表编号为"' + ids + '"的数据项？').then(function () {
        return delPersonnel(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('peoples/personnel/export', {
        ...this.queryParams
      }, `personnel_${new Date().getTime()}.xlsx`)
    },
    salesDetails(row) {
      const id = row.id
      salesDetails(id).then(response => {
        this.salesMonth = response.data.salesMonth;
        this.commissionsMonth = response.data.commissionsMonth;
        this.productsList = response.data.products;
      })
      this.Synthesize = true;

    },
    // 修改vip
    onVipChange(row){

    },
  }
};
</script>
<style>
.sales-total,
.commission-total {
  font-size: 16px;
  color: #303133; /* 可以根据主题调整颜色 */
}

.dialog-footer {
  text-align: right;
  border-top: 1px solid #ebeef5;
  padding: 10px 16px;
}
</style>
