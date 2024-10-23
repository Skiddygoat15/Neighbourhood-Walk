import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        // 从 URL 查询参数中获取用户信息
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const roles = urlParams.get('roles') ? urlParams.get('roles').split(',') : [];
        const token = urlParams.get('token');

        // 将用户信息存储到 sessionStorage
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('roles', JSON.stringify(roles));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('isLogin', 'true');

        // 根据用户角色重定向到相应的页面
        if (roles.length === 1) {
            // 如果 roles 长度为 1，根据唯一的角色重定向
            if (roles[0] === 'parent') {
                window.location.href = '/home-parent';
            } else if (roles[0] === 'walker') {
                window.location.href = '/home-walker';
            }
        } else if (roles.length > 1) {
            // 如果 roles 长度大于 1，跳转到身份选择页面
            window.location.href = '/registration-login-identity-select';
        }
    }, [router]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export default OAuthRedirect;
