<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
        z-index: 999;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #fff;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .layout-footer-center{
        text-align: center;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Header :style="{background:'#fff'}">
                <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo">
                        <img src="/static/logo.png" />
                    </div>
                    <div class="layout-nav">
                        <Menu-item name="1" to="/">
                          <Icon type="md-home"></Icon>
                          首页
                        </Menu-item>
                        <Menu-item name="2" to="/product">
                          <Icon type="md-albums" />
                          产品
                        </Menu-item>
                    </div>
                </Menu>
            </Header>
            <Content :style="{background: '#fff', minHeight: '500px'}">
                 <router-view/>
            </Content>
            <Footer class="layout-footer-center">2011-2016 &copy; <a href="https://beian.miit.gov.cn">湘ICP备20010164号-1</a>
            </Footer>
        </Layout>
    </div>
</template>
<script>
export default {

}
</script>
