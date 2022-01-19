import React from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Lessons() {
  const { t } = useTranslation();
  return (
    <div>
      <Card className="border-black bg-info bg-opacity-25">
        <Card.Body>
          <Card.Title>{t("messages.hi")}</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
            molestiae pariatur, repellendus veniam enim excepturi tenetur modi
            laborum vero est? Animi, distinctio cumque eligendi iste,
            voluptatibus consequuntur, sint repudiandae voluptates quod optio
            similique aspernatur
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
}
