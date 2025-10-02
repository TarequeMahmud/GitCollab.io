"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Container from "./Container";

type UserdataModalProps = {
  userObject: {
    userdata: Contributor;
    setUserdata: (value: null) => void;
  };
  tasks: Task[];
};

type UserInfo = {
  name: string;
  username: string;
  email: string;
  about: string;
};

const UserdataModal = ({ userObject, tasks }: UserdataModalProps) => {
  const { fetchWithAuth } = useAuth();
  const { userdata, setUserdata } = userObject;
  const [userinfo, setUserinfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const taskForUser = tasks.filter(
    (task) => task.assignee.id === userdata.user
  );

  const countByStatus = (status: string) =>
    taskForUser.filter((t) => t.status === status).length;

  useEffect(() => {
    if (!userdata?.user) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const userResponse = await fetchWithAuth(`/accounts/${userdata.user}`, {
          method: "get",
        });
        setUserinfo(userResponse!.ok ? await userResponse.json() : null);
      } catch (error) {
        console.error("there was an error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userdata]);

  const propertyItems = userinfo
    ? [
      { label: "Username:", value: userinfo.username },
      { label: "Email:", value: userinfo.email },
      { label: "Role:", value: userdata.role.toUpperCase() },
      { label: "Total Tasks Assigned:", value: taskForUser.length },
      {
        label: "Tasks Stats:",
        value: (
          <>
            <b>{countByStatus("completed")}</b> completed;{" "}
            <b>{countByStatus("in-progress")}</b> in progress;{" "}
            <b>{countByStatus("to-do")}</b> to-do;
          </>
        ),
      },
    ]
    : [];

  return (
    <Container type="modal">
      <div className="bg-white w-[550px] min-h-[350px] max-w-full h-auto rounded-2xl border-2 border-white/70 shadow-lg flex flex-col justify-start items-center p-8 overflow-y-auto">
        {loading && <p className="mt-40 text-2xl">Loading data...</p>}

        {userinfo && (
          <>
            <h1 className="text-3xl font-bold text-black">{userinfo.name}</h1>
            <hr className="w-4/5 my-2 border-gray-400" />

            <div className="w-4/5 flex flex-col gap-2">
              {propertyItems.map((item) => (
                <div key={item.label} className="flex flex-row gap-5">
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="break-words">{item.value}</p>
                </div>
              ))}
            </div>

            <hr className="w-4/5 my-2 border-gray-400" />

            {userinfo.about?.length > 0 && (
              <>
                <p className="w-4/5 leading-7">
                  {userinfo.about.length > 200
                    ? `${userinfo.about.slice(0, 200)}...`
                    : userinfo.about}
                </p>
                <hr className="w-4/5 my-2 border-gray-400" />
              </>
            )}

            <button
              onClick={() => setUserdata(null)}
              className="bg-pink-600 w-3/5 h-10 mt-5 rounded-full font-bold text-lg"
            >
              OK
            </button>
          </>
        )}
      </div>
    </Container>
  );
};

export default UserdataModal;
