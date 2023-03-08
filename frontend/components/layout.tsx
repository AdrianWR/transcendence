import { BackgroundImage, Flex } from "@mantine/core";
import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
    children: ReactNode
    imageSrc?: string;
    imageHeight?: string;
}

const Layout: FC<Props> = ({ children, imageSrc = "/images/webb-deep-field.png", imageHeight = "100%" }: Props) => {
    return (
        <Flex id="TESTE">
          <BackgroundImage h={imageHeight} src={imageSrc}>
            <Navbar />
              {children}
            <Footer />
          </BackgroundImage>
        </Flex>

    );
}

export default Layout;
