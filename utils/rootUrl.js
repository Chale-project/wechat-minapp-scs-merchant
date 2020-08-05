
var tokenUrl = "/api/token"
var refreshtokenUrl = "/api/refresh"
var sessioncodeUrl = "/merchant/getSessionIdByCode/"
var verCodeUrl = "/merchant/registerSmsSend/"
var forgetCodeUrl = "/merchant/forgetPasswordSmsSend/"
var registerUrl = "/merchant/register"
var forgetUrl = "/merchant/forget"
var userInfoUrl = "/merchant/getMerchantInfo"
//获取店铺列表
var getshoplistUrl = "/shop/getShopList"
var addshopUrl = "/shop/add"
var uploadfileUrl = "/basic/file/upload"
var addprocaterUrl = "/category/add"
var procaterlistUrl = "/category/list/"
var addShipCard = "/membershipRule/add"
var getShopShip = "/membershipRule/list"
var getShopShipDetail = "/membershipRule/info"
var modifyShipCard = "/membershipRule/modify"
var userManageData = "/shopAnalysis/customerAnalysis"
var deletecaterUrl = "/category/deleted/"
var modifycaterUrl = "/category/modify"
var getqrcodeUrl = "/shop/modifyQrCodePath"
var addgoodsUrl = "/goods/add"
var addgoodsNewUrl = "/goods/new/add"
var goodslistUrl = "/goods/list"
var orderList = "/order/page"
var addCoupon = "/coupon/add"
var couponList = "/coupon/pageQuery"
var listlowUrl = "/goods/downaway/"
var listupUrl = "/goods/putaway/"
var prodetailUrl = "/goods/info/"
var prodeletUrl = "/goods/deleted/"
var prosaveUrl = "/goods/modify"
var prosavenewUrl = "/goods/new/modify"
var prolistcaterUrl = "/goods/category/"
var analyseGoodsDataUrl = "/goodsSanalysis/info/"
var deleteCoupon = "/coupon/delete"
var customerList = "/shopAnalysis/customerList"
var customerDetail = "/shopCustomer/getShopCustomerInfo"
var getSeckillGoodsUrl = "/seckillGoods/new/list"
var sendCoupon = "/coupon/pushCoupon"
var upgradeMemeber = "/shopMembership/add"
var userCoupons ="/coupon/hasTake"
var deletseckillGoodsUrl = "/seckillGoods/new/deleted/"
var jiaoyishezhi = '/shopDeploy/add'
var addseckillGoodsUrl = "/seckillGoods/new/add/more"
var addIntegral = '/integralShop/add'
var getIntegral = '/integralShop/info/'
var modifyIntegral = '/integralShop/modify'
var closeIntegral = '/integralShop/close/'
var getOrderDetail = '/order/Info/'
var getchooseSeckGoodsUrl = "/seckillGoods/new/goods/list"
var getshopinfoSetUrl = "/shopDeploy/info"
var shopdeliveryUrl = "/shop/modify"
var shopskillgoodsdetail = "/seckillGoods/new/info/desc/"
var getshopinfoUrl = "/shop/getShopInfo/"
var adjectiveShopUrl = "/virtualGoods/agency/pageQuery"
var adjectiveShopUpUrl = "/virtualGoods/agency/put/"
var adjectiveShopDownUrl = "/virtualGoods/agency/out/"
var getCustomerStep = "/shopCustomer/getCustomerStep"
var getCustomerGoods = "/shopCustomer/getCustomerGoods"
var sendProductOut = "/order/modify"
var pickGoods = "/order/pickGoods/"
var rechargeCard = "/rechargeCard/add"
var rechargeCardInfo = "/rechargeCard/info/"
var rechargeCardList = "/rechargeCard/list"
var rechargeforbidden = "/rechargeCard/forbidden/"
var scanVerification = "/order/verification/"
var chaxunShopCode = "/goods/getGoodsCode/"
var indexCustomerAnalysis = "/shopAnalysis/indexCustomerAnalysis"
var changecaterLocationUrl = "/category/sort/"
var deletedRechargeCard= "/rechargeCard/deleted/"
var getMoneyManage = "/order/ShopJournalAccount/page"
var shopAnalysis = "/shopAnalysis/confirmReceipt/"
var userAgreeUrl = "/common/userAgreement"
var huoquProListUrl = "/commodityStocks/list"
var addshopGuangergaoUrl = "/Advertising/add"
var searchShopGuangUrl = "/Advertising/info/"
var changeGuangUrl = "/Advertising/modify"
var searchOrder ="/order/title/page"
var balanceDetail = "/shopAnalysis/page"
var goodsOtherCaterUrl = "/commodityStocks/category/list"
var productstoreUrl = "/goodsImport/import/modify"
var onecaterallproUrl = "/category/page"
var getshopcodeUrl = "/shop/translateUrl/"
//店铺角色添加
var addRoleUrl = "/shopOperator/addRole"
//店铺角色编辑
var shopRoleUrl = "/shopOperator/modifyRole"
//店铺角色删除
var deleteRolUrl = "/shopOperator/removeRoles"
//店员信息查询
var studentInfoSearchUrl = "/shopOperator/roleInfo/"
var searchShopRoleListUrl = "/shopOperator/roleList"
var saveFormId = "/shop/saveFormId"
var typePush = "/coupon/typePush"
var addcuropraterUrl = "/shopOperator/addShopOperator"
var searchopratelistUrl = "/shopOperator/shopOperatorlist"
var searchopratedetailUrl = "/shopOperator/shopOperatorInfo/"
var changeOpratePasswordUrl = "/shopOperator/modifyShopOperator"
var shopcontentlistUrl = "/common/merchantMenu"
var loginBandOpenidUrl = "/shopOperator/bandOpenid/"
var getOperatorInfoUrl = "/merchant/getOperatorInfo"
var propaixuUrl = "/goods/sort/"
var goodsRecommendlist = "/goods/recommend/list"
var recommenpaixuUrl = "/goods/recommend/sort/"
var prorecommenUrl = "/goods/recommend/"
var newRecommensetUrl = "/goods/set/recommend/"
var verificationByCode = "/order/verificationByCode/"
var pickAllGoods = "/order/pickAllGoods/"
var integralShop = "/integralShop/page/"
var outloginUrl = "/api/destory"
var pichingGoodsList = "/goodsGroup/list/"
var goodsGroupDelete = "/goodsGroup/delete/"
var pichingGoodsDetail = "/goodsGroup/info/"
var addPiching = "/goodsGroup/add/"
var productSkillDetailUrl = "/seckillGoods/new/statement/list"
var couponDetail = "/coupon/info/"
var groupPeople = "/orderGroup/page"
var recommenSalePriceUrl = "/goods/getGoodsPrice/"
var groupUserList = "/orderGroup/groupUserList/"
var modifyGroup = "/goodsGroup/modify/"
var shopbusinessUrl = "/shop/businessStateInfo/"//店铺营业状态
var shopModifyBusinessUrl = "/shop/updatebusinessState"
var addgroupCodeUrl = "/shop/addGroupPic"
var shopwxcodedetailUrl = "/shop/infoGroupPic/"
var homeAddSubjectUrl = "/subjects/add"
var homeSubjectDetailUrl = "/subjects/info/"
var homeSubjectListUrl = "/subjects/list"
var homeModifySubjectUrl = "/subjects/modify"
var homesubjectDeletUrl = "/subjects/deleted/"
var homesubjectproUrl = "/subjects/goods/list"
var saveFormIdAndOpenId = "/shop/saveFormIdAndOpenId"
var homesubjectchooseproUrl = "/subjects/goods/goods/list"
var homesubjectaddGoodsUrl = "/subjects/goods/add"
var homesubjectdeletegoodsUrl = "/subjects/goods/deleted/"
var orderArrived = "/order/arrived/"
var deliveryman = "/order/deliveryman/"
var deliverymanSave = "/order/deliveryman/save/"
var getOperatorMenuInfo = "/merchant/getOperatorMenuInfo/"
var commissionRecordDesc = "/commissionRecordDesc/list"
var commissionEarnings = "/commissionEarnings/info/"
var commissionEarningsList = "/commissionEarnings/page/"
var integralShopUser = "/integralShop/use/page/"

module.exports = {
  integralShopUser,
  commissionEarningsList,
  commissionEarnings,
  commissionRecordDesc,
  deliverymanSave,
  getOperatorMenuInfo,
  deliveryman,
  orderArrived,
  saveFormIdAndOpenId,
  homesubjectdeletegoodsUrl,
  homesubjectaddGoodsUrl,
  homesubjectchooseproUrl,
  homesubjectproUrl,
  homesubjectDeletUrl,
  homeModifySubjectUrl,
  homeSubjectListUrl,
  homeSubjectDetailUrl,
  homeAddSubjectUrl,
  shopwxcodedetailUrl,
  addgroupCodeUrl,
  prosavenewUrl,
  addgoodsNewUrl,
  shopModifyBusinessUrl,
  shopbusinessUrl,
  modifyGroup,
  groupUserList,
  groupPeople,
  couponDetail,
  recommenSalePriceUrl,
  goodsRecommendlist,
  newRecommensetUrl,
  recommenpaixuUrl,
  productSkillDetailUrl,
  goodsGroupDelete,
  outloginUrl,
  addPiching,
  pichingGoodsDetail,
  pichingGoodsList,
  integralShop,
  verificationByCode,
  pickAllGoods,
  propaixuUrl,
  getOperatorInfoUrl,
  loginBandOpenidUrl,
  shopcontentlistUrl,
  changeOpratePasswordUrl,
  searchopratedetailUrl,
  searchopratelistUrl,
  addcuropraterUrl,
  addRoleUrl,
  shopRoleUrl,
  deleteRolUrl,
  studentInfoSearchUrl,
  searchShopRoleListUrl,
  balanceDetail,
  searchOrder,
  tokenUrl,
  refreshtokenUrl,
  sessioncodeUrl,
  verCodeUrl,
  forgetCodeUrl,
  registerUrl,
  forgetUrl,
  userInfoUrl,
  addshopUrl,
  getshoplistUrl,
  uploadfileUrl,
  addprocaterUrl,
  procaterlistUrl,
  addShipCard,
  getShopShip,
  getShopShipDetail,
  modifyShipCard,
  userManageData,
  deletecaterUrl,
  modifycaterUrl,
  getqrcodeUrl,
  addgoodsUrl,
  goodslistUrl,
  orderList,
  addCoupon,
  couponList,
  listlowUrl,
  listupUrl,
  prodetailUrl,
  prodeletUrl,
  prosaveUrl,
  prolistcaterUrl,
  analyseGoodsDataUrl,
  deleteCoupon,
  customerList,
  customerDetail,
  getSeckillGoodsUrl,
  sendCoupon,
  upgradeMemeber,
  userCoupons,
  deletseckillGoodsUrl,
  jiaoyishezhi,
  addseckillGoodsUrl,
  addIntegral,
  modifyIntegral,
  getIntegral,
  closeIntegral,
  getOrderDetail,
  getchooseSeckGoodsUrl,
  getshopinfoSetUrl,
  shopdeliveryUrl,
  shopskillgoodsdetail,
  getshopinfoUrl,
  adjectiveShopUrl,
  adjectiveShopUpUrl,
  adjectiveShopDownUrl,
  getCustomerStep,
  getCustomerGoods,
  sendProductOut,
  pickGoods,
  rechargeCard,
  rechargeCardInfo,
  rechargeCardList,
  rechargeforbidden,
  scanVerification,
  chaxunShopCode,
  indexCustomerAnalysis,
  changecaterLocationUrl,
  deletedRechargeCard,
  prorecommenUrl,
  getMoneyManage,
  shopAnalysis,
  userAgreeUrl,
  huoquProListUrl,
  addshopGuangergaoUrl,
  searchShopGuangUrl,
  changeGuangUrl,
  goodsOtherCaterUrl,
  productstoreUrl,
  onecaterallproUrl,
  getshopcodeUrl,
  saveFormId,
  typePush
}