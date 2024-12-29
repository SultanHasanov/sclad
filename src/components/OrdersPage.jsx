import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, InputNumber, message } from 'antd';
import axios from 'axios';

const OrderEdit = ({ order, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(order.items);

  // Функция для обновления количества товара
  const handleQuantityChange = (value, itemId) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Функция для обновления цены товара
  const handlePriceChange = (value, itemId) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, price: value.toString() };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Сохранить изменения
  const handleSave = () => {
    const updatedOrder = { ...order, items };
    onSave(updatedOrder); // Передаем обновленные данные в родительский компонент
  };

  // Формирование колонок для таблицы
  const columns = [
    {
      title: 'Товар',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => handlePriceChange(value, record.id)}
          min={0}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (
        <InputNumber
          value={text}
          onChange={(value) => handleQuantityChange(value, record.id)}
          min={1}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: 'Сумма',
      key: 'totalPrice',
      render: (text, record) => {
        return `${(record.price * record.quantity).toFixed(2)} руб.`;
      }
    }
  ];

  return (
    <Modal
      title={`Редактировать заказ №${order.id}`}
      visible={true}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
        }}
      >
        <Form.Item label="ФИО заказчика" name="customerName">
          <Input />
        </Form.Item>
        <Form.Item label="Телефон" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Адрес" name="address">
          <Input />
        </Form.Item>

        <h3>Товары в заказе</h3>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="id"
          pagination={false}
          style={{ marginBottom: 16 }}
        />
      </Form>
    </Modal>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Загружаем заказы с сервера
  const loadOrders = async () => {
    try {
      const response = await axios.get('https://b25a776acd1c337f.mokky.dev/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Ошибка при загрузке заказов');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Открытие модального окна для редактирования заказа
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
  };

  // Сохранение изменений
  const handleSaveOrder = async (updatedOrder) => {
    try {
      await axios.patch(`https://b25a776acd1c337f.mokky.dev/orders/${updatedOrder.id}`, updatedOrder);
      message.success('Заказ обновлен');
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      setSelectedOrder(null); // Закрываем модальное окно
    } catch (error) {
      message.error('Ошибка при обновлении заказа');
    }
  };

  // Удаление заказа
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`https://b25a776acd1c337f.mokky.dev/orders/${orderId}`);
      message.success('Заказ удален');
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      message.error('Ошибка при удалении заказа');
    }
  };

  // Закрытие модального окна без сохранения изменений
  const handleCancel = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <h2>Список заказов</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <span>Заказ №{order.id} - {order.customerName}</span>
            <Button onClick={() => handleEditOrder(order)}>Редактировать</Button>
            <Button onClick={() => handleDeleteOrder(order.id)} danger style={{ marginLeft: 10 }}>
              Удалить
            </Button>
          </li>
        ))}
      </ul>

      {/* Открываем модальное окно для редактирования */}
      {selectedOrder && (
        <OrderEdit
          order={selectedOrder}
          onSave={handleSaveOrder}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default OrdersPage;
