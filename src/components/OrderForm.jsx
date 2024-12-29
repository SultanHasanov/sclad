import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Table,
  Space,
  Typography,
  message,
  Collapse,
} from "antd";
import axios from "axios";

const { Text } = Typography;
const { Panel } = Collapse;

const OrderForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  // Загрузка списка товаров
  useEffect(() => {
    axios
      .get("https://b25a776acd1c337f.mokky.dev/items")
      .then((response) => setItems(response.data))
      .catch((error) => message.error("Ошибка загрузки товаров"));
  }, []);

  useEffect(() => {
    axios.get('https://b25a776acd1c337f.mokky.dev/orders')
      .then(response => setOrders(response.data))
      .catch(error => message.error('Ошибка загрузки заказов'));
  }, []);

  // Расчет общей суммы
  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity || 0),
      0
    );
    setOrderTotal(total);
  };

  // Добавление товара в заказ
  const handleAddProduct = (value) => {
    const productsToAdd = items.filter((item) => value.includes(item.id));

    const updatedItems = [...selectedItems];
    productsToAdd.forEach((product) => {
      if (!updatedItems.some((item) => item.id === product.id)) {
        updatedItems.push({ ...product, quantity: 1 });
      }
    });

    setSelectedItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Отправка заказа в API
  const handleSubmit = async (values) => {
    const orderData = {
      customerName: values.name,
      phone: values.phone,
      address: values.address,
      payment: values.payment,
      items: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price, // Цены передаем как строки, как в базе
      })),
      totalAmount: orderTotal,
    };

    if (editOrder) {
      // Если редактируем заказ, отправляем PUT запрос для обновления
      try {
        const response = await axios.patch(
          `https://b25a776acd1c337f.mokky.dev/orders/${editOrder.id}`,
          orderData
        );
        const updatedOrders = orders.map((order) =>
          order.id === editOrder.id ? response.data : order
        );
        setOrders(updatedOrders);
        message.success("Заказ успешно обновлен");
      } catch (error) {
        message.error("Ошибка при обновлении заказа");
      }
    } else {
      // Если новый заказ, отправляем POST запрос для создания
      try {
        const response = await axios.post(
          "https://b25a776acd1c337f.mokky.dev/orders",
          orderData
        );
        setOrders([...orders, response.data]);
        message.success("Заказ успешно добавлен");
      } catch (error) {
        message.error("Ошибка при добавлении заказа");
      }
    }

    // Сброс состояния после отправки
    setEditOrder(null);
    form.resetFields();
    setSelectedItems([]);
    setOrderTotal(0);
  };

  // Удаление товара из заказа
  const handleRemoveProduct = (productId) => {
    const updatedItems = selectedItems.filter((item) => item.id !== productId);
    setSelectedItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Изменение количества товара
  const handleChangeQuantity = (value, productId) => {
    const updatedItems = selectedItems.map((item) =>
      item.id === productId ? { ...item, quantity: value } : item
    );
    setSelectedItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Удаление заказа
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `https://b25a776acd1c337f.mokky.dev/orders/${orderId}`
      );
      setOrders(orders.filter((order) => order.id !== orderId));
      message.success("Заказ успешно удален");
    } catch (error) {
      message.error("Ошибка при удалении заказа");
    }
  };

  // Редактирование заказа
  const handleEditOrder = (order) => {
    setEditOrder(order);
    form.setFieldsValue({
      name: order.customerName,
      phone: order.phone,
      address: order.address,
      payment: order.payment,
    });
    setSelectedItems(
      order.items.map((item) => ({
        ...item,
        quantity: item.quantity,
      }))
    );
    setOrderTotal(order.totalAmount);
    setIsFormVisible(true);
  };

  // Настройка таблицы товаров
  const columns = [
    { title: "Название товара", dataIndex: "name", key: "name" },
    {
      title: "Цена",
      dataIndex: "minPrice",
      key: "minPrice",
      render: (minPrice) => `${parseFloat(minPrice).toFixed(2)} руб.`,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          defaultValue={quantity}
          onChange={(value) => handleChangeQuantity(value, record.id)}
        />
      ),
    },
    {
      title: "Итого",
      key: "total",
      render: (text, record) =>
        `${(parseFloat(record.minPrice) * record.quantity).toFixed(2)} руб.`,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleRemoveProduct(record.id)}>
          Удалить
        </Button>
      ),
    },
  ];

  const columns2 = [
    { title: "Название товара", dataIndex: "name", key: "name" },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (price) => `${parseFloat(price).toFixed(2)} руб.`,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          defaultValue={quantity}
          onChange={(value) => handleChangeQuantity(value, record.id)}
        />
      ),
    },
    {
      title: "Итого",
      key: "total",
      render: (text, record) =>
        `${(parseFloat(record.price) * record.quantity).toFixed(2)} руб.`,
    },
   
  ];

  // Форматирование данных для отображения в списке заказов
  const formattedOrders = orders.map((order) => ({
    ...order,
    totalAmount: order.items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity || 0),
      0
    ), // Расчет общей суммы для заказа
  }));

  return (
    <div>
      {/* Кнопка для показа/скрытия формы */}
      <Button
        type="primary"
        onClick={() => setIsFormVisible(!isFormVisible)}
        style={{ marginBottom: 20 }}
      >
        {isFormVisible ? "Скрыть форму заказа" : "Оформить заказ"}
      </Button>

      {/* Форма заказа */}
      {isFormVisible && (
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label="ФИО"
            rules={[{ required: true, message: "Введите ваше ФИО" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Номер телефона"
            rules={[{ required: true, message: "Введите номер телефона" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Адрес"
            rules={[{ required: true, message: "Введите ваш адрес" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="payment"
            label="Внесенная оплата"
            rules={[{ required: true, message: "Введите сумму оплаты" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label="Выберите товары">
            <Select
              mode="multiple"
              placeholder="Выберите товары"
              style={{ width: "100%" }}
              onChange={handleAddProduct}
              filterOption={(input, option) => {
                const itemName = option.children[0]; // Название товара из дочернего элемента
                return itemName.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {items.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Table
            columns={columns}
            dataSource={selectedItems}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: 16 }}
          />

          <div style={{ marginBottom: 16 }}>
            <Text strong>Общая сумма: {orderTotal.toFixed(2)} руб.</Text>
          </div>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {editOrder ? "Обновить заказ" : "Оформить заказ"}
          </Button>
        </Form>
      )}

      {/* Список заказов с возможностью редактирования и удаления */}
      <div style={{ marginTop: 32 }}>
        <h3>Список заказов</h3>
        <Collapse accordion>
          {formattedOrders.map((order) => (
             <Panel
             header={(
               <>
                 <span>Заказ №{order.id}</span>
                 <span> - Оплачено: {order.payment}</span>
                 <span> - Общая сумма: {order.totalAmount} руб.</span>
               </>
             )}
             key={order.id}
             style={{
               border: order.payment === order.totalAmount ? 'green  solid' : 'white', // Зеленый если оплачено = сумма
               borderRadius: "5px"
             }}
             extra={[
               <Button key="edit" onClick={() => handleEditOrder(order)} type="link">Редактировать</Button>,
               <Button key="delete" onClick={() => handleDeleteOrder(order.id)} type="link">Удалить</Button>
             ]}
           >
             <Table
               columns={columns2}
               dataSource={order.items}
               rowKey="id"
               pagination={false}
               style={{ marginBottom: 16 }}
             />
           </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default OrderForm;
