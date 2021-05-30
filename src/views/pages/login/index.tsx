import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';

import useInput from '@hooks/useInput';
import useStore from '@hooks/useStore';
import { postData, getData } from '@utils/rest';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/signup/styles';

const LogIn = () => {
  const { UserData } = useStore();

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    getData('/api/users').then((result) => {
      UserData.setMyData(result);
    });
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLogInError(false);
      try {
        await postData('/api/users/login', { email, password });
        const user_data = await getData('/api/users');
        UserData.setMyData(user_data);
      } catch (error) {
        setLogInError(error.response?.data?.statusCode === 401);
      }
    },
    [email, password],
  );

  if (UserData.myData === undefined) {
    return <div>로딩중...</div>;
  }

  if (UserData.myData) {
    const workspace_url = UserData.myData.Workspaces[0].url;
    const redirect = `/workspace/${workspace_url}/channel/일반`;
    return <Redirect to={redirect} />;
  }

  return (
    <div id="container">
      <Header>React Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default observer(LogIn);
