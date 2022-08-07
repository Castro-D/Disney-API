module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('generos', [
      {
        nombre: 'romance',
        imagen: 'path',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        nombre: 'thriller',
        imagen: 'path',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        nombre: 'mistery',
        imagen: 'path',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        nombre: 'fantasy',
        imagen: 'path',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
      {
        nombre: 'drama',
        imagen: 'path',
        created_at: '2021-02-03 14:41:40.673+00',
        updated_at: '2021-02-03 14:41:40.673+00',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('generos', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
