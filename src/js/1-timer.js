document.addEventListener('DOMContentLoaded', function() {
  const datetimePicker = document.getElementById('datetime-picker');
  const startButton = document.getElementById('start-button');
  const daysValue = document.querySelector('[data-days]');
  const hoursValue = document.querySelector('[data-hours]');
  const minutesValue = document.querySelector('[data-minutes]');
  const secondsValue = document.querySelector('[data-seconds]');

  let countdownInterval;

  function addLeadingZero(value) {
      return String(value).padStart(2, '0');
  }

  function calculateTimeLeft(endTime) {
      const difference = endTime - Date.now();

      if (difference <= 0) {
          clearInterval(countdownInterval);
          return {
              total: 0,
              days: '00',
              hours: '00',
              minutes: '00',
              seconds: '00'
          };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
          total: difference,
          days: addLeadingZero(days),
          hours: addLeadingZero(hours),
          minutes: addLeadingZero(minutes),
          seconds: addLeadingZero(seconds)
      };
  }

  function handleStartButtonClick() {
      const selectedDate = new Date(datetimePicker.value);

      if (selectedDate <= Date.now()) {
          iziToast.error({
              title: 'Error',
              message: 'Please choose a date in the future.'
          });
          return;
      }

      startButton.disabled = true;
      datetimePicker.disabled = true;

      countdownInterval = setInterval(() => {
          const timeLeft = calculateTimeLeft(selectedDate);

          daysValue.textContent = timeLeft.days;
          hoursValue.textContent = timeLeft.hours;
          minutesValue.textContent = timeLeft.minutes;
          secondsValue.textContent = timeLeft.seconds;

          if (timeLeft.total === 0) {
              clearInterval(countdownInterval);
              startButton.disabled = false;
              datetimePicker.disabled = false;
          }
      }, 1000);
  }

  flatpickr(datetimePicker, {
      enableTime: true,
      time_24hr: true,
      minuteIncrement: 1,
      onClose: function(selectedDates) {
          const selectedDate = selectedDates[0];

          if (selectedDate <= Date.now()) {
              startButton.disabled = true;
              iziToast.error({
                  title: 'Error',
                  message: 'Please choose a date in the future.'
              });
          } else {
              startButton.disabled = false;
          }
      }
  });

  startButton.addEventListener('click', handleStartButtonClick);
});

