import images from "@/assets/icons/conversation/icons";
import Container from "@/components/Container";
import Image from "next/image";

const ConversationPage = () => {
  const conversations = [1, 2, 3, 4];
  return (
    <Container title="Conversations">
      {/* show all the Conversations */}
      <div className="my-12 mx-auto w-11/12 flex flex-col justify-center items-center gap-8">
        {conversations.map((conversation) => (
          <div
            className="w-full h-[150px] bg-white rounded-[15px] flex flex-row justify-between items-center"
            key={conversation}
          >
            {/* left: icon + description */}
            <div className="w-[80%] h-full flex flex-row items-center justify-start">
              <div className="flex items-center justify-center">
                <Image
                  className="h-[100px] w-[100px] object-contain mx-[25px]"
                  src={images.message}
                  alt="message"
                />
              </div>

              <div className="ml-8 text-black h-[120px] flex flex-col justify-between items-start">
                {/* title + meta stacked vertically (matches the original SCSS) */}
                <div className="flex flex-col justify-center items-start">
                  <h2 className="m-0 text-lg font-semibold">
                    Website Redesign
                  </h2>
                  <p className="m-0 font-medium text-[0.8rem]">
                    18 Total Messages
                  </p>
                </div>

                {/* snippet at the bottom */}
                <p className="mb-1">
                  <b>Mehedi: </b> How are you all?
                </p>
              </div>
            </div>

            {/* right: time + unread */}
            <div className="w-[15%] h-full flex flex-col justify-center items-center text-black">
              <p className="font-medium text-sm">10:00am</p>
              <div className="w-[45px] h-[45px] bg-[#eb1313] rounded-full flex items-center justify-center mt-2">
                <p className="text-white font-medium text-[1.1rem] leading-none">
                  3
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ConversationPage;
