<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品价格" prop="productPrice">
        <el-input
          v-model="queryParams.productPrice"
          placeholder="请输入商品价格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工手机号" prop="employeeMobile">
        <el-input
          v-model="queryParams.employeeMobile"
          placeholder="请输入员工手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户手机号" prop="customerMobile">
        <el-input
          v-model="queryParams.customerMobile"
          placeholder="请输入客户手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="paymentAmount">
        <el-input
          v-model="queryParams.paymentAmount"
          placeholder="请输入订单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreatedAt"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['orders:manage:add']"
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
          v-hasPermi="['orders:manage:edit']"
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
          v-hasPermi="['orders:manage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['orders:manage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="订单号" align="center" prop="orderNumber" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品价格" align="center" prop="productPrice" />
      <el-table-column label="销售姓名" align="center" prop="employeeName" />
      <el-table-column label="销售手机号" align="center" prop="employeeMobile" />
      <el-table-column label="销售手机号" align="center" prop="employeeMobile" />
      <el-table-column label="树状关系图" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" circle @click="handleSelect(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="所获提成" align="center" prop="commission" />
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column label="客户手机号" align="center" prop="customerMobile" />
      <el-table-column label="客户收货地址" align="center" prop="customerAddress" />
      <el-table-column label="订单金额" align="center" prop="paymentAmount" sortable/>
      <el-table-column label="订单状态" align="center" prop="orderStatus" >
      <template slot-scope="scope">
        <template v-if="scope.row.orderStatus === 0">
          <span style="color: #00afff;font-weight: bold;">待处理</span>
        </template>
        <template v-else-if="scope.row.orderStatus === 1">
          <span style="color: #13ce66;font-weight: bold;">处理中</span>
        </template>
        <template v-else-if="scope.row.orderStatus === 2">
          <span style="color: red;font-weight: bold; ">已完成</span>
        </template>
      </template>
      </el-table-column>

      <el-table-column label="订单处理" align="center" width="150" >
        <template slot-scope="scope">
          <template v-if="scope.row.orderStatus == 0">
            <el-button type="primary" round size="mini" @click="handleOrder(scope.row)">处理订单</el-button>
          </template>
          <template v-else-if="scope.row.orderStatus == 1">
            <el-button type="success" round size="mini" @click="finishOrder(scope.row)">完成订单</el-button>
          </template>
          <template v-else-if="scope.row.orderStatus == 2">
            <el-button type="danger" round size="mini">已完成</el-button>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createdAt" width="150" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updatedAt" width="150">
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
            v-hasPermi="['orders:manage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['orders:manage:remove']"
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

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model="form.productPrice" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="员工ID" prop="employeeId">
          <el-input v-model="form.employeeId" placeholder="请输入员工ID" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="form.employeeName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="员工手机号" prop="employeeMobile">
          <el-input v-model="form.employeeMobile" placeholder="请输入员工手机号" />
        </el-form-item>
        <el-form-item label="所获提成" prop="commission">
          <el-input v-model="form.commission" placeholder="请输入所获提成" />
        </el-form-item>
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="客户手机号" prop="customerMobile">
          <el-input v-model="form.customerMobile" placeholder="请输入客户手机号" />
        </el-form-item>
        <el-form-item label="客户收货地址" prop="customerAddress">
          <el-input v-model="form.customerAddress" placeholder="请输入客户收货地址" />
        </el-form-item>
        <el-form-item label="订单金额" prop="paymentAmount">
          <el-input v-model="form.paymentAmount" placeholder="请输入订单金额" />
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

  </div>
</template>

<script>
import { listManage, getManage, delManage, addManage, updateManage,updateOrderStatus,addCommission } from "@/api/orders/manage";
import { getPersonnel, selectAllSuById } from "@/api/peoples/personnel";
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
      // 订单管理表格数据
      manageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 订单状态时间范围
      daterangeCreatedAt: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        productName: null,
        productPrice: null,
        employeeMobile: null,
        customerMobile: null,
        paymentAmount: null,
        createdAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productId: [
          { required: true, message: "商品ID不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
        employeeId: [
          { required: true, message: "员工ID不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "客户ID不能为空", trigger: "blur" }
        ],
        paymentAmount: [
          { required: true, message: "订单金额不能为空", trigger: "blur" }
        ],
      },
      personnel:{},
      treeData:[],
      rowPositionId:'',
      dialogVisible:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreatedAt && '' != this.daterangeCreatedAt) {
        this.queryParams.params["beginCreatedAt"] = this.daterangeCreatedAt[0];
        this.queryParams.params["endCreatedAt"] = this.daterangeCreatedAt[1];
      }
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
        orderNumber: null,
        productId: null,
        productName: null,
        productPrice: null,
        employeeId: null,
        employeeName: null,
        employeeMobile: null,
        commission: null,
        customerId: null,
        customerName: null,
        customerMobile: null,
        customerAddress: null,
        paymentAmount: null,
        orderStatus: null,
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
      this.daterangeCreatedAt = [];
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
      this.title = "添加订单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getManage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单管理";
      });
    },
    /**查看关系图*/
    handleSelect(row){
      const id=row.employeeId;
      getPersonnel(id).then(response=>{
        this.personnel=response.data;
        this.rowPositionId=this.personnel.superiorId;
        selectAllSuById(id,this.rowPositionId).then(response => {
          this.treeData=response.rows;
          this.treeData.sort((a, b) => a.positionId - b.positionId);
        })
      })

      this.dialogVisible=true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除订单管理编号为"' + ids + '"的数据项？').then(function() {
        return delManage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('orders/manage/export', {
        ...this.queryParams
      }, `manage_${new Date().getTime()}.xlsx`)
    },
    /** 处理订单*/
    handleOrder(row){
      const id=row.id;
      const orderStatus=1;
      const data={
        id:id,
        orderStatus:orderStatus
      };
      updateOrderStatus(data).then(response=>{
        if(response.code===200){
          this.getList();
        }
      })
    },
    finishOrder(row){
      const id=row.id;
      const orderStatus=2;
      const data={
        id:id,
        orderStatus:orderStatus
      };
      updateOrderStatus(data).then(response=>{
        if(response.code===200){
          this.getList();
        }
      })
      const data2={
        orderId:id,
        personId:row.employeeId,
        productId:row.productId,
        commissionAmount:'',
      };
      addCommission(data2).then(response=>{

      })
    },
  }
};
</script>
