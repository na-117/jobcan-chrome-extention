import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const Container = styled.div`
  min-width: 350px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const List = styled.ul`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
`;

const Button = styled.button`
  align-self: flex-end;
  background-color: #1EB8D9;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  list-style: none;
`;

const Comment = styled.p`
  align-self: flex-end;
`;

const Popup = () => {
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [workTime, setWorkTime] = useState(0);
  const [restWorkTime, setRestWorkTime] = useState(0);
  const [restWorkDays, setRestWorkDays] = useState(0);

  const calculateWorkTime = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            code: `calculateWorkTime`,
          },
            (response) => {
                const [hour, minutes] = response['actualWorkingHour'].split(':');
                const actualWorking = parseFloat(`${hour}.${minutes}`);
                const [todayHour, todayMinutes] = response['todayWorkingHours'].split(':');
                const todayActualWorking = parseFloat(`${todayHour}.${todayMinutes}`);
                const [hour1, minutes2] = response['monthProvisionWorkingHours'].split(':');
                const provisionWorking = parseFloat(`${hour1}.${minutes2}`);
                const [hour2, minutes3] = response['paidLeaveHours'].split(':');
                const totalWorking = actualWorking + parseFloat(`${hour2}.${minutes3}`);
                const workingDays = parseFloat(response['workingDays']) + parseFloat(response['paidLeaveDays']);

                // 稼働中でない場合
                if (todayActualWorking === 0) {
                    setTotalWorkTime(totalWorking);
                    setWorkTime(totalWorking / workingDays);
                    const remainDays = response['scheduledWorkingDays'].replace('日', '') - workingDays;
                    if (remainDays === 0) {
                        setRestWorkDays(0);
                        setRestWorkTime(0);
                        return;
                    }
                    setRestWorkDays(remainDays);
                    setRestWorkTime((provisionWorking - todayActualWorking) / remainDays);
                    return;
                }

                const beforeProvisionWorking = totalWorking - todayActualWorking;
                setWorkTime(beforeProvisionWorking / (workingDays - 1));
                const remainDays = response['scheduledWorkingDays'].replace('日', '') - (response['workingDays'] - 1)
                setTotalWorkTime(beforeProvisionWorking);
                setRestWorkDays(remainDays);
                setRestWorkTime((provisionWorking - beforeProvisionWorking) / remainDays);
            }
        );
      }
    });
  };

  return (
      <Container>
          <List>
              <ListItem>稼働合計時間：{totalWorkTime}</ListItem>
              <ListItem>平均稼働時間：{workTime}</ListItem>
              <ListItem>残りの稼働時間/日：{restWorkTime}</ListItem>
              <ListItem>残りの稼働日：{restWorkDays}</ListItem>
          </List>
          <Button onClick={calculateWorkTime}>稼働時間を計算</Button>
          <Comment>※稼働中の場合は前日までの稼働時間で計算をしています。</Comment>
      </Container>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
