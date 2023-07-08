import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { baseApis } from '@/apis';
import useMessage from 'antd/es/message/useMessage';
import GLOBAL_CONFIG from '@/config';
import { setToken } from '@/utils/token.ts';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { RouterContext } from '@/App.tsx';
import { HandleRouterInfo, HandleRouters } from '@/utils/router.tsx';

const LoginFormComponent = () => {
    const { setRouters, setRouterInfo } = useContext(RouterContext)
    const [ messageApi, contextHolder ] = useMessage()
    const navigate = useNavigate()
    useEffect(() => {
        baseApis.checkLogin()
            .then(res => {
                if (res.code === GLOBAL_CONFIG.SUCCESS_STATUS) return handleGetRouter()
            }).then(() => navigate('/dashboard')
        )
    })
    const handleGetRouter = async () => {
        const { data } = await baseApis.getRouter()
        setRouters(HandleRouters({ handleRouters: data }))
        setRouterInfo(HandleRouterInfo({ handleRouterInfo: data }))
    }
    const onFinish = async (values: never) => {
        const { code, data } = await baseApis.login(values)
        if (code !== GLOBAL_CONFIG.SUCCESS_STATUS) {
            messageApi.error('请输入正确的信息')
            return
        }
        setToken(data)
        await handleGetRouter()
        navigate('/dashboard')
    }

    return (
        <div className={ 'w-96 h-96' }>
            { contextHolder }
            <div className={ 'text-black text-3xl font-bold text-center mb-12 mt-12' }>
                系统登录
            </div>
            <Form
                name="login-form"
                style={ { maxWidth: 600 } }
                onFinish={ onFinish }
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={ [ { required: true, message: 'Please enter the correct user name' } ] }
                >
                    <Input className={ 'h-10' } placeholder={ '请输入账号' } prefix={ <UserOutlined/> }/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={ [ { required: true, message: 'Please enter the correct password' } ] }
                >
                    <Input.Password className={ 'h-10' } placeholder={ '请输入密码' } prefix={ <LockOutlined/> }/>
                </Form.Item>
                <div className={ 'w-56 h-10 ml-auto mr-auto' }>
                    <Form.Item>
                        <Button className={ 'w-56 h-10' } type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}

export default LoginFormComponent
