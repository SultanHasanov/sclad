import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Modal,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import '../App.css'

const { Option } = Select;

const apiUrl = "https://b25a776acd1c337f.mokky.dev/items";

const AddItemsComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from the API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setItems(response.data);
    } catch (error) {
      message.error("Не удалось загрузить данные.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (values) => {
    const newItem = {
      ...values,
      group: isNewGroup ? newGroup : values.group,
    };

    try {
      if (editingItem) {
        await axios.patch(`${apiUrl}/${editingItem.id}`, newItem);
        message.success("Предмет обновлён успешно.");
      } else {
        await axios.post(apiUrl, newItem);
        message.success("Предмет добавлен успешно.");
      }
      fetchItems();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Не удалось сохранить предмет.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      message.success("Товар удалён успешно.");
      fetchItems();
    } catch (error) {
      message.error("Не удалось удалить товар.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGroup ? item.group === selectedGroup : true)
  );

  const uniqueGroups = Array.from(new Set(items.map((item) => item.group)));

  const columns = [
    { 
      title: "Название", 
      dataIndex: "name", 
      key: "name",
      responsive: ["xs", "sm", "md", "lg", "xl"], // Отображается на всех экранах
    },
    { 
      title: "Мин. Цена", 
      dataIndex: "minPrice", 
      key: "minPrice",
      responsive: ["md", "lg", "xl"], // Скрывается на маленьких экранах
    },
    { 
      title: "Цена Покупки", 
      dataIndex: "purchasePrice", 
      key: "purchasePrice",
      responsive: ["lg", "xl"], // Скрывается на экранах меньше 'lg'
    },
    { 
      title: "Цена Продажи", 
      dataIndex: "sellingPrice", 
      key: "sellingPrice",
      responsive: ["lg", "xl"], // Скрывается на экранах меньше 'lg'
    },
    { 
      title: "Единица", 
      dataIndex: "unit", 
      key: "unit",
      responsive: ["md", "lg", "xl"], // Скрывается на экранах меньше 'md'
    },
    { 
      title: "Группа", 
      dataIndex: "group", 
      key: "group",
      responsive: ["sm", "md", "lg", "xl"], // Скрывается только на 'xs'
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsNewGroup(false);
              setModalVisible(true);
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Вы уверены, что хотите удалить этот товар?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"], // Действия видны на всех экранах
    },
  ];
  

  return (
    <div>
      <Input
        placeholder="Поиск по названию"
        value={searchQuery}
        onChange={handleSearch}
        style={{ width: 200, marginBottom: 20 }}
      />
      <Select
        placeholder="Выберите группу"
        value={selectedGroup}
        onChange={(value) => setSelectedGroup(value)}
        style={{ width: 200, marginBottom: 20, marginLeft: 10 }}
      >
        <Option value="">Все группы</Option>
        {uniqueGroups.map((group) => (
          <Option key={group} value={group}>
            {group}
          </Option>
        ))}
      </Select>

      <Button
        type="primary"
        onClick={() => {
          setEditingItem(null);
          setModalVisible(true);
        }}
      >
        Добавить товар
      </Button>

      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        loading={loading}
        style={{ marginTop: "20px" }}
      />

      <Modal
        title={editingItem ? "Редактировать товар" : "Добавить товар"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddEdit} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Пожалуйста, введите название" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="minPrice"
            label="Мин. Цена"
            rules={[{ required: true, message: "Пожалуйста, введите минимальную цену" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="purchasePrice"
            label="Цена Покупки"
            rules={[{ required: true, message: "Пожалуйста, введите цену покупки" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="sellingPrice"
            label="Цена Продажи"
            rules={[{ required: true, message: "Пожалуйста, введите цену продажи" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Единица"
            rules={[{ required: true, message: "Пожалуйста, выберите единицу" }]}
          >
            <Select>
              <Option value="шт">шт</Option>
              <Option value="кг">кг</Option>
              <Option value="см">см</Option>
              <Option value="м">м</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="group"
            label="Группа"
            rules={[{ required: !newGroup, message: "Пожалуйста, выберите или добавьте группу" }]}
          >
            <Select
              placeholder="Выберите группу"
              onChange={(value) => {
                if (value === "new_group") {
                  setIsNewGroup(true);
                  form.setFieldsValue({ group: "" });
                } else {
                  setIsNewGroup(false);
                  form.setFieldsValue({ group: value });
                }
              }}
            >
              {uniqueGroups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
              <Option style={{color: 'green'}} value="new_group">
               + Добавить новую группу
              </Option>
            </Select>
          </Form.Item>

          {isNewGroup && (
            <Form.Item
              label="Название новой группы"
              rules={[{ required: true, message: "Пожалуйста, введите название новой группы" }]}
            >
              <Input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AddItemsComponent;
