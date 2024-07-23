<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
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
          v-hasPermi="['products:manage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['products:manage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['products:manage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['products:manage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="序号" align="center" prop="id" />-->
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品图片" align="center" prop="productImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.productImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" prop="productPrice" />
      <el-table-column label="商品总经理提成" align="center" prop="gmCommission" />
      <el-table-column label="商品销售部经理提成" align="center" prop="salesManagerCommission" />
      <el-table-column label="商品区域经理提成" align="center" prop="regionalManagerCommission" />
      <el-table-column label="商品区域销售经理提成" align="center" prop="regionalSalesManagerCommission" />
      <el-table-column label="商品销售人员提成" align="center" prop="salespersonCommission" />
      <el-table-column label="付款码图片" align="center" prop="paymentCodeImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.paymentCodeImage" :width="50" :height="50"/>
        </template>
      </el-table-column>

      <el-table-column label="商品销售详情" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" circle @click="handleSelect(scope.row)"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['products:manage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['products:manage:remove']"
          >删除</el-button>
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

    <!-- 添加或修改商品管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品图片" prop="productImage">
          <image-upload v-model="form.productImage"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model="form.productPrice" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="商品总经理提成" prop="gmCommission">
          <el-input v-model="form.gmCommission" placeholder="请输入商品总经理提成" />
        </el-form-item>
        <el-form-item label="商品销售部经理提成" prop="salesManagerCommission">
          <el-input v-model="form.salesManagerCommission" placeholder="请输入商品销售部经理提成" />
        </el-form-item>
        <el-form-item label="商品区域经理提成" prop="regionalManagerCommission">
          <el-input v-model="form.regionalManagerCommission" placeholder="请输入商品区域经理提成" />
        </el-form-item>
        <el-form-item label="商品区域销售经理提成" prop="regionalSalesManagerCommission">
          <el-input v-model="form.regionalSalesManagerCommission" placeholder="请输入商品区域销售经理提成" />
        </el-form-item>
        <el-form-item label="商品销售人员提成" prop="salespersonCommission">
          <el-input v-model="form.salespersonCommission" placeholder="请输入商品销售人员提成" />
        </el-form-item>
        <el-form-item label="付款码图片" prop="paymentCodeImage">
          <image-upload v-model="form.paymentCodeImage"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="商品销售详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-table
        :data="personnelVOList"
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
        <el-table-column
          prop="total"
          label="销售数量">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { listManage, getManage, delManage, addManage, updateManage } from "@/api/products/manage";
import { personnelVOlist } from "@/api/orders/manage";
export default {
  name: "Manage",
  data() {
    return {
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
      // 商品管理表格数据
      manageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        createdAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
      },
      personnelVOList: [],
      dialogVisible:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品管理列表 */
    getList() {
      this.loading = true;
      listManage(this.queryParams).then(response => {
        this.manageList = response.rows;
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
        productName: null,
        productImage: null,
        productPrice: null,
        gmCommission: null,
        salesManagerCommission: null,
        regionalManagerCommission: null,
        regionalSalesManagerCommission: null,
        salespersonCommission: null,
        paymentCodeImage: null,
        createdAt: null,
        updatedAt: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getManage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateManage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 人员销售情况*/
    handleSelect(row){
      const productId = row.id
      console.log('idididid',productId)
      personnelVOlist(productId).then(response => {
        this.personnelVOList = response.rows;
      })
      this.dialogVisible = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品管理编号为"' + ids + '"的数据项？').then(function() {
        return delManage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('products/manage/export', {
        ...this.queryParams
      }, `manage_${new Date().getTime()}.xlsx`)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>
