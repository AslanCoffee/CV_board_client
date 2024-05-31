<template>
    <div class="user-create">
      <!-- Кнопка открытия модального окна -->
      <button class="open-button" @click="openModal">Создать пользователя</button>
  
      <!-- Модальное окно -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <!-- Поля ввода для данных -->
          <div class="input-container">
            <input type="text" v-model="name" placeholder="ФИО" />
          </div>
          <div class="input-container">
            <input type="text" v-model="department" placeholder="Отдел" />
          </div>
          <div class="input-container">
            <input type="text" v-model="email" placeholder="Email" />
          </div>
          <div class="input-container">
            <input type="text" v-model="password" placeholder="Пароль" />
          </div>
          <div class="input-container">
            <select v-model="role">
                <option v-for="role in roleOptions" :key="role">{{ role }}</option>
            </select>
          </div>
  
          <!-- Кнопки Сохранить и Отменить -->
          <div class="button-container">
            <button class="save-button" @click="saveUser">Сохранить</button>
            <button class="cancel-button" @click="confirmCancel">Отменить</button>
          </div>
        </div>
      </div>
  
      <!-- Окно подтверждения отмены -->
      <div v-if="showConfirmCancel" class="confirmation-modal">
        <div class="modal-content">
          <p>Вы уверены, что хотите отменить?</p>
          <div class="button-container">
            <button class="confirm-button" @click="cancel">Да</button>
            <button class="cancel-button" @click="closeConfirmation">Нет</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: false,
        showConfirmCancel: false, // Показывать ли окно подтверждения
        name: '',
        department: '',
        email: '',
        password: '',
        role: '',
        roleOptions: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
      };
    },
    methods: {
      // Метод открытия модального окна
      openModal() {
        this.showModal = true;
      },
      // Метод сохранения задачи
      saveUser() {
        if (!this.name || !this.password || !this.email || !this.role) {
          alert('Не все поля заполнены');
          return;
        }
        // Вызываем событие для создания задачи и передаем данные в родительский компонент
        this.$emit('user-create', {
          name: this.name,
          department: this.department,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        // Закрываем модальное окно
        this.showModal = false;
        this.clearFields();
      },
      // Метод отмены действия
      confirmCancel() {
        // Показываем окно подтверждения
        this.showConfirmCancel = true;
      },
      // Метод подтверждения отмены
      cancel() {
        // Закрываем модальное окно и окно подтверждения
        this.showModal = false;
        this.showConfirmCancel = false;
        this.clearFields();
      },
      // Метод закрытия окна подтверждения
      closeConfirmation() {
        this.showConfirmCancel = false;
      },
      clearFields() {
        this.name = '';
        this.department = '';
        this.email = '';
        this.password = '';
        this.role = '';
      }
    }
  };
  </script>

  <style scoped>
  /* Стили для модального окна */
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    width: 70%;
    max-width: 400px; /* Максимальная ширина модального окна */
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Тень для модального окна */
    display: flex;
    flex-direction: column; /* Разместить элементы вертикально */
  }
  
  /* Стили для контейнеров полей ввода */
  .input-container {
    margin-bottom: 15px; /* Отступ между полями */
  }
  
  textarea {
    height: 100px; /* Увеличенная высота текстовой области */
    resize: vertical; /* Позволяет изменять высоту текстовой области */
  }
  
  /* Стили для кнопки открытия модального окна */
  .open-button {
    font-family:  'Montserrat Alternates', sans-serif;
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    padding: 10px 20px;
    background-color: #ffd300;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .open-button:hover {
    background-color: #d6b302;
  }
  
  /* Стили для окна подтверждения отмены */
  .confirmation-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .confirmation-modal .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Тень для модального окна */
  }
  
  /* Стили для кнопок в модальных окнах */
  .button-container {
    display: flex;
    justify-content: space-between;
  }
  
  .save-button,
  .confirm-button,
  .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family:  'Montserrat Alternates', sans-serif;
  }
  
  .save-button {
    background-color: #28a745;
    color: #fff;
  }
  
  .confirm-button {
    background-color: #ffc107;
    color: #000;
  }
  
  .cancel-button {
    background-color: #dc3545;
    color: #fff;
  }
  
  .save-button:hover,
  .confirm-button:hover,
  .cancel-button:hover {
    opacity: 0.8;
  }
  </style>
  