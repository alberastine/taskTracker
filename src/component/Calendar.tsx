import { useEffect, useState } from "react";
import { Calendar, Modal, Button, Input, Form, Badge } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import axios from "../api/axios";
import WidgetWrapper from "./WidgetWrapper";

import { CalendarEvent } from "../models/User";

import "../styles/components/Calendar.css";

const TaskCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventTitle, setEditingEventTitle] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/events");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const onDateClick = (date: Dayjs) => {
    setEditingEventTitle("");
    setSelectedDate(date);
    setIsModalVisible(true);
    setEditingEventId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewEventTitle("");
  };

  const handleAddEvent = async () => {
    setEditingEventTitle("");
    if (!newEventTitle || !selectedDate) return;

    const newEvent = {
      title: newEventTitle,
      date: selectedDate.format("YYYY-MM-DD"),
    };

    try {
      await axios.post("/events", newEvent);

      const res = await axios.get("/events");
      setEvents(res.data);

      setNewEventTitle("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  // Edit event
  const handleEditEvent = async () => {
    setEditingEventTitle("");
    if (!editingEventTitle || !editingEventId) return;

    const updatedEvent = {
      title: editingEventTitle,
    };

    try {
      const res = await axios.put(`/events/${editingEventId}`, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === editingEventId
            ? { ...event, title: res.data.title }
            : event,
        ),
      );
      setEditingEventId(null);
      setEditingEventTitle("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`/events/${eventId}`);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId),
      );
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const getEventsForDate = (date: Dayjs) => {
    return events.filter((event) => dayjs(event.date).isSame(date, "day"));
  };

  const cellRender = (date: Dayjs) => {
    const dayEvents = getEventsForDate(date);
    return (
      <ul>
        {dayEvents.map((event, index) => (
          <li
            key={
              event._id ||
              `${event.title}-${index}-${date.format("YYYY-MM-DD")}`
            }
          >
            <Badge status="success" text={event.title} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <WidgetWrapper>
      <div>
        <div className="calendar-container">
          <Calendar onSelect={onDateClick} cellRender={cellRender} />
        </div>

        <Modal
          title={`Events on ${selectedDate?.format("MMMM D, YYYY")}`}
          open={isModalVisible}
          onCancel={handleCancel}
          width={400}
          className="event-modal"
          footer={[
            <Button
              key="back"
              type="primary"
              onClick={handleCancel}
              className="cancel-btn"
              color="danger"
              variant="outlined"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={editingEventId ? handleEditEvent : handleAddEvent}
              disabled={editingEventId ? !editingEventTitle : !newEventTitle}
              className="submit-btn"
            >
              {editingEventId ? "Update Event" : "Add Event"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <h4 className="existing-events-title">
              {editingEventId ? "Edit Event Title" : "New Event Title"}
            </h4>
            <Form.Item className="event-form-item">
              <Input
                value={editingEventId ? editingEventTitle : newEventTitle}
                onChange={(e) =>
                  editingEventId
                    ? setEditingEventTitle(e.target.value)
                    : setNewEventTitle(e.target.value)
                }
                placeholder="Enter event title"
                className="event-input"
              />
            </Form.Item>
          </Form>

          {getEventsForDate(selectedDate!).length > 0 && (
            <>
              <h4 className="existing-events-title">Existing Events:</h4>
              <ul className="events-list">
                {getEventsForDate(selectedDate!).map((event, index) => (
                  <li
                    key={event._id || `${event.title}-${index}`}
                    className="event-item"
                  >
                    <span className="event-title">{event.title}</span>
                    <div className="event-actions">
                      <Button
                        type="text"
                        className="action-btn edit-btn"
                        onClick={() => {
                          setEditingEventId(event._id);
                          setEditingEventTitle(event.title);
                        }}
                        icon={<EditOutlined />}
                      />
                      <Button
                        type="text"
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteEvent(event._id)}
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal>
      </div>
    </WidgetWrapper>
  );
};

export default TaskCalendar;
